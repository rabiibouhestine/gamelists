export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-center flex-wrap gap-2 bg-card py-8">
      © {year} Game Lists, by
      <a
        className="hover:underline"
        href="https://rabiibouhestine.com"
        target="_blank"
      >
        Rabii Bouhestine
      </a>
    </footer>
  );
}
