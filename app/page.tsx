import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
