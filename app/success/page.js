export default function Success() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Order confirmed!</h1>
        <p className="text-zinc-600">
          Thanks for your order, we will start preparing it shortly.
        </p>
        <a href="/" className="mt-6 inline-block text-sm font-medium underline text-zinc-800">
          Back to menu
        </a>
      </div>
    </div>
  );
}