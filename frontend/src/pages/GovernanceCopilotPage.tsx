import React, { useState } from "react";
import { Bot, Send, Sparkles, Shield, Lock, Terminal, Cpu, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  cardData?: any;
}

const samplePrompts = [
  "Summarize high-risk agents in Treasury operations",
  "Check SWIFT Wire Policy compliance status for today",
  "List active incidents requiring human sign-off",
  "Show budget utilization forecast for next 7 days",
];

export const GovernanceCopilotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "copilot",
      text: "Hello! I am your AI Governance Copilot. I analyze system logs, trust scores, OPA policies, and budget telemetry in read-only mode. How can I assist your security team today?",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setIsThinking(true);

    setTimeout(() => {
      let card: any = null;
      let replyText = "Based on real-time control plane telemetry:";

      if (query.toLowerCase().includes("risk") || query.toLowerCase().includes("treasury")) {
        replyText = "I found 2 agents in Treasury Operations exceeding risk threshold (Score > 80):";
        card = {
          title: "High Risk Agents in Treasury",
          items: [
            { name: "High-Freq Arbitrage Bot #9", risk: 94, status: "Quarantined" },
            { name: "FX Hedging Agent Alpha", risk: 81, status: "Restricted" },
          ],
        };
      } else if (query.toLowerCase().includes("swift") || query.toLowerCase().includes("policy")) {
        replyText = "SWIFT Transfer Limit Policy (pol-101) compliance summary for today:";
        card = {
          title: "OPA Policy Telemetry: pol-101",
          items: [
            { metric: "Total Evaluated Requests", val: "14,250" },
            { metric: "Allowed", val: "14,210 (99.7%)" },
            { metric: "Denied (Over Limit)", val: "40 (0.3%)" },
          ],
        };
      } else {
        replyText = "Control plane telemetry indicates all 2,500 agents are operating within calibrated OPA guardrails. Zero security breaches detected in the last 24 hours.";
      }

      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: "copilot",
        text: replyText,
        cardData: card,
      };

      setMessages((prev) => [...prev, copilotMsg]);
      setIsThinking(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            AI Governance Assistant Copilot
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Enterprise read-only AI assistant for natural language telemetry analysis and governance queries.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <Lock className="w-3.5 h-3.5" />
          <span>Read-Only Guardrail: Enforced</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 h-[520px] flex flex-col justify-between shadow-2xl">
        {/* Messages Scroll View */}
        <div className="space-y-4 overflow-y-auto pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs font-mono ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "copilot" && (
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className="max-w-xl space-y-2">
                <div
                  className={`p-4 rounded-xl border ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-slate-900/90 text-slate-200 border-slate-800"
                  }`}
                >
                  {m.text}
                </div>

                {m.cardData && (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <h4 className="font-semibold text-blue-400 border-b border-slate-800 pb-2">{m.cardData.title}</h4>
                    <div className="space-y-1 text-slate-300">
                      {m.cardData.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-1.5 bg-slate-800/40 rounded">
                          <span>{it.name || it.metric}</span>
                          <span className="text-white font-bold">{it.status || it.val || `Risk: ${it.risk}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing control plane telemetry & OPA logs...</span>
            </div>
          )}
        </div>

        {/* Bottom Prompts & Input Bar */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 whitespace-nowrap transition-colors shrink-0"
              >
                💡 {p}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask Copilot about agent risk, trust scores, policies or spending limits..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
            <Button
              variant="primary"
              icon={<Send className="w-4 h-4" />}
              onClick={() => handleSend()}
            >
              Ask
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
