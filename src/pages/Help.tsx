import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, BookOpen, MessageSquare, FileCheck, Video } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Help() {
  const faqs = [
    {
      question: 'What is flipped learning?',
      answer:
        'Flipped learning is an instructional strategy where students gain first exposure to new material outside of class, usually via videos or readings. In-class time is then devoted to deeper discussion, problem-solving, and active learning.',
    },
    {
      question: 'How do I access course materials?',
      answer:
        'Navigate to the Resources page to browse all available course materials. You can filter by module/week and view videos, PDFs, and other learning resources.',
    },
    {
      question: 'Can I retake quizzes?',
      answer:
        'Yes! You can retake quizzes as many times as you like. Your best score will be tracked, and you can review explanations for each question after submission.',
    },
    {
      question: 'How do I ask questions?',
      answer:
        'Visit the Forum page to view existing discussions or start a new thread. You can post questions, reply to others, and engage with both peers and teachers.',
    },
    {
      question: 'How do I mark a resource as complete?',
      answer:
        'After viewing a resource, click the "Mark Complete" button on the resource card. This helps you track your progress and helps teachers monitor engagement.',
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Resources',
      description: 'Access videos, PDFs, and other course materials organized by module.',
    },
    {
      icon: FileCheck,
      title: 'Assessments',
      description: 'Take quizzes to test your knowledge with instant feedback and explanations.',
    },
    {
      icon: MessageSquare,
      title: 'Forum',
      description: 'Engage in discussions, ask questions, and collaborate with peers.',
    },
    {
      icon: Video,
      title: 'Video Learning',
      description: 'Watch embedded video content and mark your progress as you learn.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...fadeIn}>
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-primary" />
            <h1 className="font-serif text-4xl md:text-5xl">Help Center</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-12">
            Find answers to common questions and learn about platform features
          </p>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="font-serif text-2xl mb-6">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.05 }}
                >
                  <Card className="paper-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="font-serif text-lg">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-serif text-2xl mb-6">Frequently Asked Questions</h2>
          <Card className="paper-shadow">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="paper-shadow bg-primary/5">
            <CardHeader>
              <CardTitle className="font-serif">Need More Help?</CardTitle>
              <CardDescription>
                If you have additional questions or need support, please reach out to your course instructor or use the Forum to ask questions.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
