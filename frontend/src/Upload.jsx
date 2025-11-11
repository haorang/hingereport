
import { useRef, useState } from 'react'

function Upload({ handleFileUpload, dataProcessed }) {
    const inputRef = useRef(null)
    const [dragActive, setDragActive] = useState(false)

    const handleDragOver = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(true)
    }

    const handleDragLeave = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(false)
    }

    const handleDrop = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(false)
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const e = { target: { files: event.dataTransfer.files } }
            handleFileUpload(e)
        }
    }

    const handleClick = () => {
        inputRef.current.click()
    }

    return (
        dataProcessed ? (
            <div
            className={`border-2 border-dashed rounded-lg py-4 text-center transition-colors cursor-pointer ${dragActive ? "border-blue-500 bg-blue-100" : "border-gray-400 bg-gray-800"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{ maxWidth: 200, margin: "1em auto" }}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: "none" }}
            />
            <p className="text-sm text-[var(--hwhite)]">Click to upload a new file</p>
        </div>
        ) : (
        <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive ? "border-blue-500 bg-blue-100" : "border-gray-400 bg-gray-800"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{ maxWidth: 400, margin: "1em auto" }}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: "none" }}
            />
            <p className="text-lg text-[var(--hwhite)] mb-2">Drag and drop <strong>matches.json</strong> file here</p>
            <p className="text-sm text-[var(--hwhite)]">or click to choose a file</p>
        </div>
        )
    )
}


export default Upload