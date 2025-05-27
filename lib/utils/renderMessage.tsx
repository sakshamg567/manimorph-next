import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { renderWithLatex } from "../renderWithLatex";
import React, { useEffect, SetStateAction, Dispatch, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Streaming-safe parser
export function parseStreamingManimResponse(content: string) {
   // Find <manim_breakdown>...</manim_breakdown> (may be partial)
   const breakdownStart = content.indexOf("<manim_breakdown>");
   const breakdownEnd = content.indexOf("</manim_breakdown>");
   let breakdown = null;
   if (breakdownStart !== -1) {
      if (breakdownEnd !== -1) {
         breakdown = content.slice(
            breakdownStart + "<manim_breakdown>".length,
            breakdownEnd
         );
      } else {
         breakdown = content.slice(breakdownStart + "<manim_breakdown>".length);
      }
   }

   // Find <code>...</code> (may be partial)
   const codeStart = content.indexOf("<code>");
   const codeEnd = content.indexOf("</code>");
   let code = null;
   if (codeStart !== -1) {
      if (codeEnd !== -1) {
         code = content.slice(codeStart + "<code>".length, codeEnd);
      } else {
         code = content.slice(codeStart + "<code>".length);
      }
   }

   // Explanation is everything before <manim_breakdown>
   let explanation = "";
   if (breakdownStart !== -1) {
      explanation = content.slice(0, breakdownStart).trim();
   } else {
      explanation = content.trim();
   }

   return { explanation, breakdown, code };
}

// Simple breakdown parser (as before)
export function parseBreakdownXML(xml: string) {
   if (!xml) return { title: "", concept: "", steps: [], formula: "", visual_style: "" };
   const getTag = (tag: string) => {
      const match = xml.match(
         new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "m")
      );
      return match ? match[1].trim() : null;
   };

   const scene_info = getTag("scene_info");
   const animation_sequence = getTag("animation_sequence");
   const text_and_labels = getTag("text_and_labels");
   const visual_style = getTag("visual_style");

   // Parse steps
   const steps: { action: string, targets: string, description: string, purpose: string }[] = [];
   if (animation_sequence) {
      const stepRegex = /<step[\s\S]*?>([\s\S]*?)<\/step>/g;
      let match;
      while ((match = stepRegex.exec(animation_sequence))) {
         const stepXML = match[1];
         const getStepTag = (tag: string) => {
            const m = stepXML.match(
               new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "m")
            );
            return m ? m[1].trim() : null;
         };
         steps.push({
            action: getStepTag("action") || "",
            targets: getStepTag("targets") || "",
            description: getStepTag("description") || "",
            purpose: getStepTag("purpose") || "",
         });
      }
   }

   // Parse scene info
   let title = "";
   let concept = "";
   if (scene_info) {
      const t = scene_info.match(/<title>([\s\S]*?)<\/title>/);
      const c = scene_info.match(/<concept>([\s\S]*?)<\/concept>/);
      title = t ? t[1].trim() : "";
      concept = c ? c[1].trim() : "";
   }

   // Parse formula from text_and_labels
   let formula = "";
   if (text_and_labels) {
      const f = text_and_labels.match(/<content>([\s\S]*?)<\/content>/);
      formula = f ? f[1].trim() : "";
   }

   return { title, concept, steps, formula, visual_style };
}

export default function RenderMessage(
   content: string,
   role: string,
   setUiState?: Dispatch<SetStateAction<"code" | "video" | "chat">>,
   reasoning?: string | undefined,
   setCode?: Dispatch<SetStateAction<string | null>>
): React.JSX.Element {
   const [isOpen, setIsOpen] = useState(false);
   const { explanation, breakdown, code } = parseStreamingManimResponse(content);
   const { title, concept, steps, formula } = parseBreakdownXML(breakdown as string);

   useEffect(() => {
      if (code) {
         setUiState?.("code");
         setCode?.(code);
      }
   }, [code, setUiState, setCode])


   function renderReasoning(reasoning: string) {
      return (
         <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="whitespace-pre-wrap overflow-wrap-anywhere">
               <CollapsibleTrigger className="flex items-center space-x-1 text-zinc-500 hover:text-zinc-300 transition-all duration-500">
                  Thinking
                  {isOpen ? <ChevronDown className="h-4 w-4 " /> : <ChevronRight className="h-4 w-4" />}
               </CollapsibleTrigger>
               <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 duration-500 ease-in-out">
                  <div className="text-[#a3a3a3] font-light mb-2 leading-relaxed border-l-2 px-4">
                     {renderWithLatex(reasoning as string)}
                  </div>
               </CollapsibleContent>
            </div>
         </Collapsible>
      )
   }

   // For user messages, just render as before
   if (role === "user") {
      return (
         <div className="mb-4 p-3 rounded-lg break-words text-white text-sm">
            <div className="font-bold mb-1">You</div>
            <div className="whitespace-pre-wrap overflow-wrap-anywhere">
               {renderWithLatex(content)}
            </div>
         </div>
      );
   }

   // If only <plainResponse>
   if (content.includes("<plainResponse>")) {
      const plain = content
         .replace(/<plainResponse>/, "")
         .replace(/<\/plainResponse>/, "")
         .trim();
      return (
         <>

            <div className="mb-4 p-3 rounded-lg break-words text-white text-sm">
               <div className="font-bold mb-1">Manimorph</div>
               {reasoning && renderReasoning(reasoning)}
               <div className="whitespace-pre-wrap overflow-wrap-anywhere">
                  {renderWithLatex(plain)}
               </div>
            </div>
         </>
      );
   }

   // Render streaming breakdown
   return (
      <div className="mb-4 p-3 rounded-lg break-words text-white text-sm">
         <div className="font-bold mb-2 flex items-center">Manimorph</div>

         {reasoning && (
            renderReasoning(reasoning)
         )}

         {/* Initial explanation */}
         {explanation && (
            <div className="mb-4 leading-relaxed">{renderWithLatex(explanation)}</div>
         )}

         {/* Artifact: Breakdown visualization */}
         {breakdown && (
            <div className="bg-[#121214] border border-[#2A2A2C] rounded-lg p-4 shadow-lg animate-fadeIn mb-4">
               <h3 className="text-base font-bold mb-2 text-white flex items-center">
                  {title || "Animation Breakdown"}
               </h3>
               {concept && (
                  <div className="mb-2 text-[#B0B0B0] italic">{concept}</div>
               )}

               <ol className="space-y-2 ml-1 mb-2">
                  {steps.map((step, i) => (
                     <li key={i} className="flex items-start group pb-1">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 group-hover:bg-white transition-colors text-black">
                           <span className="text-xs font-medium">{i + 1}</span>
                        </div>
                        <span className="text-[#E0E0E0] group-hover:text-white transition-colors">
                           <b>{step.action}</b>: {renderWithLatex(step.description)}
                           {step.purpose && (
                              <span className="ml-2 text-xs text-[#A0FFA0]">
                                 ({step.purpose})
                              </span>
                           )}
                        </span>
                     </li>
                  ))}
               </ol>

               {formula && (
                  <div className="mt-2 text-center text-lg font-bold text-[#FFD700]">
                     {renderWithLatex(formula)}
                  </div>
               )}
            </div>
         )}
      </div>
   );
}