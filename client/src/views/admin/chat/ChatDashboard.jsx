import React,
{
    useEffect,
    useState,
    useRef
} from "react";

import axios from "../../../utils/axiosInstance";

export default function ChatDashboard() {

    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState("");
    const [search, setSearch] = useState("");
    const chatEndRef = useRef(null);

    // =========================
    // FETCH CHAT SESSIONS
    // =========================
    const fetchSessions = async () => {

        try {

            const res =
                await axios.get("/chat/sessions");

            setSessions(res.data.data);

        } catch (err) {

            console.error(err);
        }
    };

    // =========================
    // FETCH CHAT DETAIL
    // =========================
    const fetchMessages = async (sessionId) => {

        try {

            const res =
                await axios.get(
                    `/chat/sessions/${sessionId}`
                );

            setMessages(res.data.data);

        } catch (err) {

            console.error(err);
        }
    };

    // =========================
    // TAKE OVER
    // =========================
    const takeOver = async () => {

        try {

            await axios.put(
                `/chat/sessions/${selectedSession.id}/takeover`
            );

            fetchSessions();

            setSelectedSession({
                ...selectedSession,
                mode: "HUMAN"
            });

        } catch (err) {

            console.error(err);
        }
    };

    // =========================
    // BACK TO AI
    // =========================
    const backToAI = async () => {

        try {

            await axios.put(
                `/chat/sessions/${selectedSession.id}/ai`
            );

            fetchSessions();

            setSelectedSession({
                ...selectedSession,
                mode: "AI"
            });

        } catch (err) {

            console.error(err);
        }
    };

    // =========================
    // SEND MESSAGE
    // =========================
    const sendMessage = async () => {

        if (!reply.trim()) return;

        try {

            await axios.post(
                `/chat/sessions/${selectedSession.id}/send`,
                {
                    message: reply
                }
            );

            setReply("");

            fetchMessages(selectedSession.id);

        } catch (err) {

            console.error(err);
        }
    };

    // =========================
    // AUTO REFRESH
    // =========================
    useEffect(() => {

        fetchSessions();

        const interval = setInterval(() => {

            fetchSessions();

            if (selectedSession) {

                fetchMessages(selectedSession.id);
            }

        }, 3000);

        return () => clearInterval(interval);

    }, [selectedSession]);

const filteredSessions =
    sessions.filter((session) => {

        const customerName =
            session.customer?.name?.toLowerCase() || "";

        const phone =
            session.customer?.phoneNumber || "";

        return (
            customerName.includes(
                search.toLowerCase()
            ) ||
            phone.includes(search)
        );
    });

    const sortedMessages =
        [...messages].sort((a, b) => {

            const dateA =
                new Date(a.createdAt);

            const dateB =
                new Date(b.createdAt);

            if (
                dateA.getTime() ===
                dateB.getTime()
            ) {

                return a.id.localeCompare(b.id);
            }

            return dateA - dateB;
        });

  useEffect(() => {

    const chatContainer =
        document.getElementById(
            "chat-container"
        );

    if (!chatContainer) return;

    const isNearBottom =
        chatContainer.scrollHeight -
        chatContainer.scrollTop -
        chatContainer.clientHeight < 100;

    if (isNearBottom) {

        setTimeout(() => {

            chatEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });

        }, 100);
    }

}, [messages]);

    return (
        <div className="p-6 h-[85vh]">

            <div className="grid grid-cols-12 gap-4 h-full">

                {/* SIDEBAR */}
                <div className="col-span-4 bg-white rounded-2xl shadow p-4 overflow-y-auto">

                    <div className="mb-4">

    <h2 className="text-xl font-bold mb-3">
        Customer Chats
    </h2>

    <input
        type="text"
        placeholder="Cari customer..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
        className="
w-full
border
rounded-xl
px-4
py-3
text-sm
focus:outline-none
focus:ring-2
focus:ring-blue-400
"
    />

</div>

                    <div className="space-y-3">

                       {filteredSessions.map((session) => (

                            <div
                                key={session.id}
                                onClick={() => {

                                    setSelectedSession(session);

                                    fetchMessages(session.id);
                                }}
                                className={`p-4 rounded-xl cursor-pointer border transition
                                
                                ${selectedSession?.id === session.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >

                                <div className="flex justify-between items-center">

                                    <div>

                                        <h3 className="font-bold">
                                            {session.customer?.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {session.customer?.phoneNumber}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">

                                        {session.needAdmin && (

                                            <span
                                                className="
            text-xs
            px-2
            py-1
            rounded-full
            font-bold
            bg-red-500
            text-white
            animate-pulse
            "
                                            >
                                                NEED HELP
                                            </span>
                                        )}

                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-semibold
        
        ${session.mode === "AI"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {session.mode}
                                        </span>

                                    </div>

                                </div>

                                <p className="text-sm text-gray-600 mt-2 truncate">
                                    {session.lastMessage}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

                {/* CHAT AREA */}
                <div className="col-span-8 bg-white rounded-2xl shadow flex flex-col">

                    {!selectedSession ? (

                        <div className="flex flex-1 justify-center items-center text-gray-400">
                            Pilih customer chat
                        </div>

                    ) : (

                        <>
                            {/* HEADER */}
                            <div
className="
sticky
top-0
z-10
bg-white
p-4
border-b
flex
justify-between
items-center
"
>

                                <div>

                                    <h2 className="font-bold text-lg">
                                        {selectedSession.customer?.name}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {selectedSession.customer?.phoneNumber}
                                    </p>

                                </div>

                                <div className="space-x-2">

                                    {selectedSession.mode === "AI" ? (

                                        <button
                                            onClick={takeOver}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            TAKE OVER
                                        </button>

                                    ) : (

                                        <button
                                            onClick={backToAI}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            KEMBALIKAN KE AI
                                        </button>
                                    )}

                                </div>

                            </div>

                            {/* CHAT BODY */}
                        
                           <div
id="chat-container"
className="
flex
flex-col
gap-4
h-[calc(85vh-180px)]
overflow-y-auto
p-5
bg-gray-50
scroll-smooth
"
>

                                {sortedMessages.map((msg) => (

                                    <div
                                        key={msg.id}
                                        className={`flex
                
            ${msg.sender === "CUSTOMER"
                                                ? "justify-start"
                                                : "justify-end"
                                            }`}
                                    >

                                        <div
                                            className={`
                
                px-4
                py-3
                rounded-2xl
                text-sm
                whitespace-pre-wrap
                break-words
                shadow-sm
                
                max-w-[380px]
min-w-[120px]
                
                ${msg.sender === "CUSTOMER"
                                                    ? `
                            bg-white
                            border
                            text-gray-800
                          `
                                                    : msg.sender === "ADMIN"
                                                        ? `
                                bg-blue-500
                                text-white
                              `
                                                        : `
                                bg-green-500
                                text-white
                              `
                                                }
                `}
                                        >

                                            {/* LABEL SENDER */}
                                            <div
                                                className="
                    text-[11px]
                    font-bold
                    opacity-80
                    mb-2
                    "
                                            >
                                                {msg.sender}
                                            </div>

                                            {/* ISI PESAN */}
                                           <div
className="
overflow-auto
max-h-[120px]
whitespace-pre-wrap
break-words
leading-relaxed
"
>
                                                {msg.message}
                                            </div>

                                            {/* JAM */}
                                            <div
                                                className="
                    text-[10px]
                    opacity-70
                    mt-2
                    text-right
                    "
                                            >
                                                {new Date(msg.createdAt)
                                                    .toLocaleTimeString(
                                                        "id-ID",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )}
                                            </div>

                                        </div>

                                    </div>
                                ))}

                                <div ref={chatEndRef}></div>

                            </div>

                            {/* INPUT */}
                            <div className="p-4 border-t flex gap-2">

                                <input
                                    type="text"
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Ketik balasan..."
                                    className="
flex-1
border
rounded-xl
p-3
focus:outline-none
focus:ring-2
focus:ring-blue-400
"
                                />

                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-500 text-white px-6 rounded-xl"
                                >
                                    Kirim
                                </button>

                            </div>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
}