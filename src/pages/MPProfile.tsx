import { useParams, useNavigate } from "react-router-dom";
import { generateMockMPs, generateMPVotingHistory, generateMPStats, mockBills } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MapPin, Building2, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MPProfile = () => {
  const { mpId } = useParams();
  const navigate = useNavigate();
  
  // Find MP from mock data (using first bill as reference)
  const allMPs = generateMockMPs(mockBills[0].id);
  const mp = allMPs.find(m => m.id === mpId);
  
  if (!mp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>ไม่พบข้อมูล</CardTitle>
            <CardDescription>ไม่พบข้อมูลของ ส.ส. ที่ท่านค้นหา</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับหน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const votingHistory = generateMPVotingHistory(mpId!);
  const stats = generateMPStats(mpId!);
  
  const getVoteBadgeVariant = (vote: string) => {
    switch (vote) {
      case "agree": return "default";
      case "disagree": return "destructive";
      case "abstain": return "secondary";
      default: return "outline";
    }
  };
  
  const getVoteLabel = (vote: string) => {
    switch (vote) {
      case "agree": return "เห็นด้วย";
      case "disagree": return "ไม่เห็นด้วย";
      case "abstain": return "งดออกเสียง";
      default: return "ไม่ลงคะแนน";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Button>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {mp.firstName} {mp.lastName}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{mp.party}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {mp.type === "constituency" 
                      ? `ส.ส. เขต ${mp.district}` 
                      : "ส.ส. บัญชีรายชื่อ"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                อัตราเข้าร่วมประชุม
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.attendanceRate}%
              </div>
              <Progress value={stats.attendanceRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                เห็นด้วย
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vote-agree">
                {stats.agreePercentage}%
              </div>
              <Progress value={stats.agreePercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ไม่เห็นด้วย
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vote-disagree">
                {stats.disagreePercentage}%
              </div>
              <Progress value={stats.disagreePercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                งดออกเสียง
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vote-abstain">
                {stats.abstainPercentage}%
              </div>
              <Progress value={stats.abstainPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Voting History */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              <CardTitle>ประวัติการลงมติ</CardTitle>
            </div>
            <CardDescription>
              รายการการลงมติในกฎหมายต่างๆ ทั้งหมด {stats.totalVotes} ครั้ง
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {votingHistory.map((record) => (
                <div 
                  key={record.billId}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {record.billName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Badge variant={getVoteBadgeVariant(record.vote)}>
                    {getVoteLabel(record.vote)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MPProfile;
