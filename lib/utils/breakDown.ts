interface SceneInfo {
   title: string;
   concept: string;
}

interface VisualProperties {
   color: string;
   position: string;
   size: string;
   style: string;
}

interface AnimationObject {
   id: string;
   description: string;
   visualProperties: VisualProperties;
}

interface AnimationStep {
   order: number;
   timing: string;
   action: string;
   targets: string;
   description: string;
   purpose: string;
}

interface TextElement {
   id: string;
   timing: string;
   content: string;
   position: string;
   emphasis: string;
   purpose: string;
}

interface VisualStyle {
   colorScheme: string;
   composition: string;
   emphasisStrategy: string;
}

interface ManimBreakdown {
   sceneInfo: SceneInfo;
   animationObjects: AnimationObject[];
   animationSequence: AnimationStep[];
   textAndLabels: TextElement[];
   visualStyle: VisualStyle;
}

export class ManimBreakdownParser {
   private extractTagContent(xml: string, tagName: string): string {
      const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
      const match = xml.match(regex);
      return match ? match[1].trim() : '';
   }

   private extractSimpleTag(xml: string, tagName: string): string {
      const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
      const match = xml.match(regex);
      return match ? match[1].trim() : '';
   }

   private extractAllTags(xml: string, tagName: string): string[] {
      const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'gi');
      const matches = [];
      let match;
      while ((match = regex.exec(xml)) !== null) {
         matches.push(match[1].trim());
      }
      return matches;
   }

   private extractAttribute(xml: string, attributeName: string): string {
      const regex = new RegExp(`${attributeName}="([^"]*)"`, 'i');
      const match = xml.match(regex);
      return match ? match[1] : '';
   }

   private parseSceneInfo(sceneInfoXml: string): SceneInfo {
      return {
         title: this.extractSimpleTag(sceneInfoXml, 'title'),
         concept: this.extractSimpleTag(sceneInfoXml, 'concept')
      };
   }

   private parseAnimationObjects(animationObjectsXml: string): AnimationObject[] {
      const objectXmls = this.extractAllTags(animationObjectsXml, 'object');

      return objectXmls.map(objectXml => {
         const visualPropsXml = this.extractTagContent(objectXml, 'visual_properties');

         return {
            id: this.extractAttribute(objectXml, 'id'),
            description: this.extractSimpleTag(objectXml, 'description'),
            visualProperties: {
               color: this.extractSimpleTag(visualPropsXml, 'color'),
               position: this.extractSimpleTag(visualPropsXml, 'position'),
               size: this.extractSimpleTag(visualPropsXml, 'size'),
               style: this.extractSimpleTag(visualPropsXml, 'style')
            }
         };
      });
   }

   private parseAnimationSequence(animationSequenceXml: string): AnimationStep[] {
      const stepXmls = this.extractAllTags(animationSequenceXml, 'step');

      return stepXmls.map(stepXml => ({
         order: parseInt(this.extractAttribute(stepXml, 'order')) || 0,
         timing: this.extractAttribute(stepXml, 'timing'),
         action: this.extractSimpleTag(stepXml, 'action'),
         targets: this.extractSimpleTag(stepXml, 'targets'),
         description: this.extractSimpleTag(stepXml, 'description'),
         purpose: this.extractSimpleTag(stepXml, 'purpose')
      }));
   }

   private parseTextAndLabels(textAndLabelsXml: string): TextElement[] {
      const textElementXmls = this.extractAllTags(textAndLabelsXml, 'text_element');

      return textElementXmls.map(textXml => ({
         id: this.extractAttribute(textXml, 'id'),
         timing: this.extractAttribute(textXml, 'timing'),
         content: this.extractSimpleTag(textXml, 'content'),
         position: this.extractSimpleTag(textXml, 'position'),
         emphasis: this.extractSimpleTag(textXml, 'emphasis'),
         purpose: this.extractSimpleTag(textXml, 'purpose')
      }));
   }

   private parseVisualStyle(visualStyleXml: string): VisualStyle {
      return {
         colorScheme: this.extractSimpleTag(visualStyleXml, 'color_scheme'),
         composition: this.extractSimpleTag(visualStyleXml, 'composition'),
         emphasisStrategy: this.extractSimpleTag(visualStyleXml, 'emphasis_strategy')
      };
   }

   public parse(input: string): ManimBreakdown | null {
      // Extract the manim_breakdown content, ignoring any surrounding text
      const breakdownXml = this.extractTagContent(input, 'manim_breakdown');

      if (!breakdownXml) {
         return null;
      }

      try {
         const sceneInfoXml = this.extractTagContent(breakdownXml, 'scene_info');
         const animationObjectsXml = this.extractTagContent(breakdownXml, 'animation_objects');
         const animationSequenceXml = this.extractTagContent(breakdownXml, 'animation_sequence');
         const textAndLabelsXml = this.extractTagContent(breakdownXml, 'text_and_labels');
         const visualStyleXml = this.extractTagContent(breakdownXml, 'visual_style');

         return {
            sceneInfo: this.parseSceneInfo(sceneInfoXml),
            animationObjects: this.parseAnimationObjects(animationObjectsXml),
            animationSequence: this.parseAnimationSequence(animationSequenceXml),
            textAndLabels: this.parseTextAndLabels(textAndLabelsXml),
            visualStyle: this.parseVisualStyle(visualStyleXml)
         };
      } catch (error) {
         console.error('Error parsing manim breakdown:', error);
         return null;
      }
   }
}