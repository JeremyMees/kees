export default function ErrorCard({ error, title }: { error: string, title: string }) {
  return (
    <div className="text-destructive p-4 bg-destructive/10 rounded-lg border border-destructive/20">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2">{error}</p>
    </div>
  );
}