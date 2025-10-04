// import { useState, useEffect, useCallback } from "react";

// const useWebSocket = () => {

//     const [ws, setWs] = useState<WebSocket | null>(null);
//     const [messageHandler, setMessageHandler] = useState<(message: string) => void>(() => { });
//     const socket = new WebSocket("ws://localhost:8181");

//     useEffect(() => {
//         setWs(socket);
//     }, []);

//     useEffect(() => {
//         if (ws) {
//             ws.onmessage = function (event) {
//                 console.log("event", event);
//                 // // const chatbox = document.getElementById("chatbox");
//                 // const message = event.data;

//                 // if (message === "CLEAR_CHAT") {
//                 //     // chatbox.innerHTML = "";
//                 //     return;
//                 // }

//                 // if (message.startsWith("History|")) {
//                 //     const historyMessages = message.substring(8).split("\n");
//                 //     historyMessages.forEach(msg => appendMessage(msg));
//                 //     return;
//                 // }

//                 // appendMessage(message);
//             };
//         }

//         // return () => socket.close();
//     }, [ws]);

//     const sendMessage = useCallback((message: string, room: string) => {
//         if (ws && message.trim() && room) {
//             ws.send(`MESSAGE|${room}|${message}`);
//         }

//     }, [ws]);

//     const onMessage = useCallback((handler: (message: string) => void) => {
//         setMessageHandler(() => handler);
//     }, [ws]);

//     const setUser = useCallback((userName: string) => {
//         if (ws && userName) {
//             ws.send(`SETNAME|${userName}`);
//         }
//     }, [ws]);

//     const createRoom = useCallback((roomName: string) => {
//         console.log("ws  ==", ws + "room name ", roomName);

//         if (ws && roomName) {
//             ws.send(`CREATE|${roomName}`);
//         }
//     }, [ws]);

//     const joinRoom = useCallback((roomName: string) => {
//         console.log("room name ", roomName);
//         if (ws && roomName) {
//             ws.send(`JOIN|${roomName}`);
//         }
//     }, [ws]);

//     const leaveRoom = useCallback((roomName: string) => {
//         if (ws && roomName) {
//             ws.send(`LEAVE|${roomName}`);
//         }
//     }, [ws]);

//     const deleteRoom = useCallback((roomName: string) => {
//         if (ws && roomName) {
//             ws.send(`DELETE|${roomName}`);
//         }
//     }, [ws]);

//     return {
//         ws: ws,
//         sendMessage,
//         setUser,
//         createRoom,
//         joinRoom,
//         leaveRoom,
//         deleteRoom,
//         onMessage
//     };
// };

// export default useWebSocket;