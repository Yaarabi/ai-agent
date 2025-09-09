import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ role, content }) {
    const isUser = role === "user";

    return (
        <div
        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-sm
            ${isUser
            ? "ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
            : "mr-auto bg-gray-800/80 text-gray-100 border border-gray-700 rounded-bl-none"
            }`}
        style={{
            minWidth: "100px",         
            maxWidth: "75%",           
            width: "fit-content",      
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
        }}
        >
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
            h3: ({ node, ...props }) => (
                <h3 className="text-base font-semibold text-blue-400 mt-4 mb-2" {...props} />
            ),
            ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-1" {...props} />
            ),
            li: ({ node, ...props }) => (
                <li className="text-gray-200" {...props} />
            ),
            strong: ({ node, ...props }) => (
                <strong className="text-white font-medium" {...props} />
            ),
            p: ({ node, ...props }) => (
                <p className="mb-2 text-gray-100" {...props} />
            ),
            }}
        >
            {content}
        </ReactMarkdown>
        </div>
    );
}
