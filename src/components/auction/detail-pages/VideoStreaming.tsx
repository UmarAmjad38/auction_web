import { useEffect, useState } from "react";
import {
    Call,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
    ParticipantView,
    useCallStateHooks
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { getStreamByLotId } from "../../Services/Methods";
import { v4 as uuidv4 } from 'uuid';

const apiKey = process.env.REACT_APP_STREAM_API_KEY as string;
const user_id = uuidv4();
const user = { id: user_id, name: "client" };

export default function ClientVideoStream({ lotId, onNoCall }: any) {
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<Call | null>(null);
    const [callId, setCallId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [adminId, setAdminId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLotDetails = async () => {
            try {
                const response = await getStreamByLotId(lotId);
                if (response.data.length) {
                    const latestLiveStream = response.data[response.data.length - 1];
                    setCallId(latestLiveStream.CallId);
                    setToken(latestLiveStream.Token);
                    setAdminId(latestLiveStream.UserId);
                }
            } catch (error) {
                console.error("Error fetching live stream details:", error);
            }
        };

        if (lotId) fetchLotDetails();
    }, [lotId]);

    useEffect(() => {
        if (!token || !callId) return;

        const myClient = new StreamVideoClient({ apiKey, user, token });
        setClient(myClient);

        return () => {
            myClient.disconnectUser();
            setClient(null);
        };
    }, [token, callId]);

    useEffect(() => {
        if (!client || !callId) return;

        const myCall = client.call("default", callId);
        myCall.join().catch((err) => {
            console.error("Failed to join the call", err);
        });

        setCall(myCall);

        return () => {
            myCall.leave().catch((err) => {
                console.error("Failed to leave the call", err);
            });
            setCall(null);
        };
    }, [client, callId]);

    if (!token || !callId) return onNoCall;
    if (!client || !call) return <h1>Loading...</h1>;

    // .htaccess
    return (
        <StreamVideo client={client}>
            <StreamTheme className="my-theme-overrides">
                <StreamCall call={call}>
                    <VideoLayout adminId={adminId} />
                </StreamCall>
            </StreamTheme>
        </StreamVideo>
    );
}

const VideoLayout = ({ adminId }: any) => {
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();
    const adminParticipant = participants.find(p => p.userId === adminId);
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            maxHeight: '600px',
            overflow: 'hidden',
        }}>
            {adminParticipant &&
                <>
                    <ParticipantView participant={adminParticipant} />
                    <style>{`.str-video__call-controls__button {display: none !important;} .str-video__participant-details__name {color:white !important}`}</style>
                </>
            }
        </div>
    );
};