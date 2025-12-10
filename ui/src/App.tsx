import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/layout"

function App() {
  return (
    <AppLayout pageName="dashboard">
      <div className="container mx-auto p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to No-CRM</CardTitle>
              <CardDescription>
                Your conversational lead management system is ready to go!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start by adding leads or asking questions like "Show me my leads" or "Research this contact".
              </p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>✨ <strong>Context Tracking:</strong> The system now tracks what you're viewing and doing</p>
                <p>⌨️ <strong>Keyboard Shortcut:</strong> Press Cmd+K (or Ctrl+K) to focus the input box</p>
                <p>🤖 <strong>Natural Language:</strong> Type commands like "go to leads" or "switch to dark mode"</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export default App