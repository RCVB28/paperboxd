import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Spinner,
  Textarea,
} from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Paperboxd UI Components</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input id="email" type="email" placeholder="john@example.com" />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>

              <Textarea id="review" placeholder="Write your review here..." />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>

              <Button variant="secondary">Secondary</Button>

              <Button variant="destructive">Danger</Button>

              <Button variant="ghost">Ghost</Button>
            </div>

            {/* Disabled Button */}
            <Button disabled>Disabled Button</Button>

            {/* Spinner */}
            <div className="flex items-center gap-4">
              <Spinner />

              <Spinner className="h-8 w-8" />

              <span>Loading Spinner</span>
            </div>

            {/* Spinner inside Button */}
            <Button disabled className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              Loading...
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
