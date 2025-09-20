export default function AuthorInfo({ authorName }: { authorName: string }) {
  return (
    <section className="flex justify-center mb-6">
      <p className="text-gray-400 text-sm">
        ✍️ Author: <span className="font-semibold text-white">{authorName}</span>
      </p>
    </section>
  );
}
