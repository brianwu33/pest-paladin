import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardChartProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function VisualCard({ title, description, children }: CardChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">{children}</div>
      </CardContent>
    </Card>
  );
}
