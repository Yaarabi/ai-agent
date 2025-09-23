

// Table Component
export function TableView({ columns, rows, options }) {
    return (
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl shadow-xl overflow-hidden p-4">
        <table
            className="w-full border-collapse text-sm text-gray-200"
            style={options?.style}
        >
            <thead className="bg-gray-800/70 text-gray-300">
            <tr>
                {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-2 text-left border-b border-gray-700">
                    {col}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, rIdx) => (
                <tr
                key={rIdx}
                className="hover:bg-gray-800/50 transition-colors"
                >
                {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2 border-b border-gray-700">
                    {cell}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

// Code Component
export function CodeView({ language, code, options }) {
    return (
        <pre
        className="bg-gray-900/80 text-green-400 font-mono text-sm p-4 rounded-2xl shadow-xl overflow-x-auto border border-gray-800"
        style={options?.style}
        >
        <code className={`language-${language}`}>{code}</code>
        </pre>
    );
}

// Video Component
export function VideoView({ url, options }) {
    return (
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl shadow-xl overflow-hidden p-2 max-w-[45vw]">
        <video
            controls
            className="rounded-xl w-full"
            style={options?.style}
            width={options?.width || 480}
        >
            <source src={url} />
            Your browser does not support the video tag.
        </video>
        </div>
    );
}

// Image Component
export function ImageView({ url, alt, options }) {
    return (
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl shadow-xl overflow-hidden p-2">
        <img
            src={url}
            alt={alt || "image"}
            className="rounded-xl w-full object-cover"
            style={options?.style}
            width={options?.width || 280}
        />
        </div>
    );
}

// Items Component
export function ItemsView({ items, options }) {
    return (
        <div
        className="bg-gray-900/70 border border-gray-800 rounded-2xl shadow-xl p-4 flex flex-col gap-3"
        style={options?.style}
        >
        {items.map((item, idx) => (
            <div
            key={idx}
            className="bg-gray-800/60 p-3 rounded-xl text-sm text-gray-200"
            >
            {typeof item === "string" ? item : JSON.stringify(item, null, 2)}
            </div>
        ))}
        </div>
    );
}
