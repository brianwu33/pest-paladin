import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VisualCardProps {
  title: string;
  children: React.ReactNode;
}

export function VisualCard({ title, children }: VisualCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">{children}</CardContent>
    </Card>
  );
}