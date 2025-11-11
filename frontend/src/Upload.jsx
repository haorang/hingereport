
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
            className={`border-2 border-dashed rounded-lg py-4 text-center transition-opacity duration-200 cursor-pointer border-[var(--hwhite)] bg-[var(--hblack)] hover:opacity-80 ${dragActive ? "opacity-80" : ""}`}
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
            className={`group border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer border-[var(--hblack)] bg-[var(--hwhite)] hover:border-[var(--hwhite)] hover:bg-[var(--hblack)] ${dragActive ? "opacity-80" : ""}`}
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
            <p className="text-lg text-[var(--hblack)] group-hover:text-[var(--hwhite)] transition-colors duration-200 mb-2">Drag and drop <strong>matches.json</strong> file here</p>
            <p className="text-sm text-[var(--hblack)] group-hover:text-[var(--hwhite)] transition-colors duration-200">or click to choose a file</p>
        </div>
        )
    )
}


export default Upload