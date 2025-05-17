import {useEffect, useRef, useState} from "react";
import {FiMessageSquare, FiSend, FiX} from "react-icons/fi";
import clsx from "clsx";
import {useDispatch, useSelector} from "react-redux";
import {useLazyAskChatQuery} from "../redux/slices/chatSlice.js";
import {addMessage} from "../redux/slices/chatMessagesSlice.js";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chatMessages);
    const [askChat] = useLazyAskChatQuery();
    const [isBotTyping, setIsBotTyping] = useState(false);
    const {userInfo} = useSelector((state) => state.auth);


    useEffect(() => {
        if (isOpen && messages.length === 0) {
            dispatch(addMessage({
                id: Date.now(),
                sender: 'bot',
                text: `Hi, ${userInfo?.firstName}! Can I help you? 👋`,
            }));
        }
    }, [isOpen, dispatch, messages.length]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        dispatch(addMessage({
            id: Date.now(),
            sender: 'user',
            text: trimmed,
        }));
        setInput('');
        setIsBotTyping(true);

        try {
            const {data}  = await askChat(trimmed);
            if (data?.response) {
                dispatch(addMessage({
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: data.response,
                }));
            } else {
                dispatch(addMessage({
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: 'No response received. Please try again later.',
                }));
            }
        } catch (err) {
            dispatch(addMessage({
                id: Date.now() + 2,
                sender: 'bot',
                text: 'An error has occurred. Please try again later.',
            }));
        } finally {
            setIsBotTyping(false);
        }
    };


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen ? (
                <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
                    <div className="bg-blue-600 text-white flex justify-between items-center p-3">
                        <span className="font-semibold flex items-center gap-2">
                            <span className="text-lg tracking-wide">🫣 Eva</span>
                        </span>
                        <button onClick={() => setIsOpen(false)}>
                            <FiX size={20}/>
                        </button>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto px-2 py-2 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={clsx(
                                    'flex py-1',
                                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                <div
                                    className={clsx(
                                        'px-2 py-2 rounded-lg max-w-[75%] text-sm',
                                        msg.sender === 'user'
                                            ? 'bg-blue-300 text-gray-900'
                                            : 'bg-gray-200 text-gray-900'
                                    )}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isBotTyping && (
                            <div className="flex justify-start py-1">
                                <div className="px-2 py-2 rounded-lg max-w-[75%] text-sm bg-gray-200 text-gray-900">
                                    Typing...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef}/>
                    </div>


                    {/* Input */}
                    <div className="p-2 border-t border-gray-200 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 px-3 py-2 rounded text-sm"
                            placeholder="Type your message..."
                        />
                        <button
                            onClick={handleSend}
                            className="text-blue-600 p-2 hover:bg-blue-100 rounded"
                        >
                            <FiSend size={18}/>
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
                >
                    <FiMessageSquare size={24}/>
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
