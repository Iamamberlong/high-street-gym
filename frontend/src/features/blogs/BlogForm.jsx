export default function BlogForm({ title, content, setTitle, setContent, error, onSubmit, submitButtonText }) {
    return (
      <form onSubmit={onSubmit} className="max-w-lg mx-auto">
        {/* Display error message if any */}
        {error && <div className="alert alert-danger mb-4">{error}</div>}
  
        <div className="form-group mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
  
        <div className="form-group mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 block w-full max-w-3xl p-2 h-96 border border-gray-300 rounded"
          />
        </div>
  
        <button type="submit" className="btn btn-primary">
          {submitButtonText || "Submit"}
        </button>
      </form>
    );
  }
  