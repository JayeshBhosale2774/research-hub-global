import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, FileText, CreditCard, Award, User } from "lucide-react";
import { MyPapers } from "@/components/author/MyPapers";
import { MyPayments } from "@/components/author/MyPayments";
import { MyCertificates } from "@/components/author/MyCertificates";

export default function AuthorDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("papers");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Author Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="papers" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">My Papers</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Certificates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="papers">
            <MyPapers />
          </TabsContent>

          <TabsContent value="payments">
            <MyPayments />
          </TabsContent>

          <TabsContent value="certificates">
            <MyCertificates />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
