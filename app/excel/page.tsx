import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the CSV Parsing App</h1>
      <p>Click the link below to view parsed CSV data.</p>
      <Link href="/excel/csv">View CSV Data</Link>  {/* No need for <a> */}
    </div>
  );
}
