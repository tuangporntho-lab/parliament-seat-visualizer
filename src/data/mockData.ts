import { MP, Bill, VoteType } from "@/types/parliament";

// Mock bills data
export const mockBills: Bill[] = [
  {
    id: "1",
    name: "พระราชบัญญัติงบประมาณรายจ่าย พ.ศ. 2567",
    date: "2024-01-15",
    description: "การอนุมัติงบประมาณรายจ่ายประจำปีงบประมาณ พ.ศ. 2567",
  },
  {
    id: "2",
    name: "พระราชบัญญัติแก้ไขเพิ่มเติมรัฐธรรมนูญ",
    date: "2024-02-20",
    description: "การแก้ไขเพิ่มเติมรัฐธรรมนูญแห่งราชอาณาจักรไทย พ.ศ. 2560",
  },
  {
    id: "3",
    name: "พระราชบัญญัติการศึกษาแห่งชาติ (ฉบับที่ 4)",
    date: "2024-03-10",
    description: "การแก้ไขเพิ่มเติมกฎหมายการศึกษา",
  },
];

// Generate mock MPs data (500 MPs)
const parties = [
  "เพื่อไทย",
  "ก้าวไกล",
  "ภูมิใจไทย",
  "ประชาชาติ",
  "พลังประชารัฐ",
  "เสรีรวมไทย",
  "ชาติพัฒนา",
  "เศรษฐกิจใหม่",
];

const firstNames = [
  "สมชาย",
  "สมหญิง",
  "วิชัย",
  "สุดา",
  "ประเสริฐ",
  "นิภา",
  "ธนา",
  "วราภรณ์",
  "ชัยวัฒน์",
  "สุรางค์",
];

const lastNames = [
  "ใจดี",
  "มั่นคง",
  "เจริญสุข",
  "สมบูรณ์",
  "วัฒนา",
  "ศรีสวัสดิ์",
  "ปรีชา",
  "รักษ์ชาติ",
  "บริสุทธิ์",
  "พัฒนากุล",
];

// Function to generate vote pattern based on bill and party
function generateVote(billId: string, party: string): VoteType {
  const seed = parseInt(billId) + party.charCodeAt(0);
  const random = (seed * 9301 + 49297) % 233280 / 233280;
  
  // Different voting patterns for different bills
  if (billId === "1") {
    // Budget bill - mostly agree
    if (random < 0.75) return "agree";
    if (random < 0.85) return "disagree";
    if (random < 0.95) return "abstain";
    return "absent";
  } else if (billId === "2") {
    // Constitution amendment - more controversial
    if (random < 0.45) return "agree";
    if (random < 0.80) return "disagree";
    if (random < 0.90) return "abstain";
    return "absent";
  } else {
    // Education bill - mixed
    if (random < 0.60) return "agree";
    if (random < 0.75) return "disagree";
    if (random < 0.90) return "abstain";
    return "absent";
  }
}

export function generateMockMPs(billId: string): MP[] {
  const mps: MP[] = [];
  
  for (let i = 0; i < 500; i++) {
    const party = parties[i % parties.length];
    const firstName = firstNames[Math.floor((i * 7) % firstNames.length)];
    const lastName = lastNames[Math.floor((i * 13) % lastNames.length)];
    const isConstituency = i < 400; // 400 constituency, 100 party-list
    
    mps.push({
      id: `mp-${i + 1}`,
      firstName,
      lastName,
      party,
      type: isConstituency ? "constituency" : "party-list",
      district: isConstituency ? `เขต ${(i % 50) + 1}` : undefined,
      vote: generateVote(billId, party),
    });
  }
  
  return mps;
}
