interface PlaceholderScreenProps {
  title: string;
  message?: string;
}

export default function PlaceholderScreen({ title, message }: PlaceholderScreenProps) {
  return (
    <section className="screen-card">
      <h1>{title}</h1>
      <p>{message ?? "This screen is intentionally a placeholder for the next Phase."}</p>
    </section>
  );
}
