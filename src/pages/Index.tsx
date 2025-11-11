import { useState, useMemo } from "react";
import { ParliamentVisualization } from "@/components/ParliamentVisualization";
import { VoteSummaryCard } from "@/components/VoteSummaryCard";
import { VoteSummaryChart } from "@/components/VoteSummaryChart";
import { BillSelector } from "@/components/BillSelector";
import { mockBills, generateMockMPs } from "@/data/mockData";
import { VoteSummary } from "@/types/parliament";
import { Landmark } from "lucide-react";

const Index = () => {
  const [selectedBillId, setSelectedBillId] = useState(mockBills[0].id);
  
  const mps = useMemo(() => generateMockMPs(selectedBillId), [selectedBillId]);
  
  const voteSummary: VoteSummary = useMemo(() => {
    const summary = {
      agree: 0,
      disagree: 0,
      abstain: 0,
      absent: 0,
      total: mps.length,
    };
    
    mps.forEach((mp) => {
      summary[mp.vote]++;
    });
    
    return summary;
  }, [mps]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary">
              <Landmark className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Parliament Voting Visualization
              </h1>
              <p className="text-sm text-muted-foreground">
                การแสดงผลการลงมติของสมาชิกสภาผู้แทนราษฎร
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <BillSelector
              bills={mockBills}
              selectedBillId={selectedBillId}
              onSelectBill={setSelectedBillId}
            />
            
            <VoteSummaryCard summary={voteSummary} />
          </aside>

          {/* Visualization */}
          <section className="lg:col-span-3 space-y-6">
            <VoteSummaryChart mps={mps} />
            
            <ParliamentVisualization mps={mps} />
            
            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-vote-agree" />
                <span>เห็นด้วย</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-vote-disagree" />
                <span>ไม่เห็นด้วย</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-vote-abstain" />
                <span>งดออกเสียง</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-vote-absent" />
                <span>ไม่ลงคะแนน</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>ข้อมูลจาก Politigraph API • สร้างด้วย Lovable</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
