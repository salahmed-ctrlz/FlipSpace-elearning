import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Target, Eye, BookOpen, Users, BarChart3 } from 'lucide-react';
import logo from '@/assets/logo.svg';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const featureCards = [
    { icon: BookOpen, title: "Centralized Resources", description: "Access all course materials, from videos to documents, in one organized library." },
    { icon: Users, title: "Collaborative Forum", description: "Engage in discussions, ask questions, and learn from peers and instructors." },
    { icon: BarChart3, title: "Insightful Analytics", description: "Teachers can track student engagement to provide targeted support." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...fadeIn}>
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl">About FlipSpace</h1>
            <p className="text-lg text-muted-foreground mt-4">
              Revolutionizing education with the flipped classroom model.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card className="paper-shadow h-full">
                    <CardHeader>
                        <CardTitle className="font-serif text-2xl flex items-center gap-3"><Info className="h-6 w-6 text-primary" /> Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>
                            To empower educators and engage students by shifting instruction to a learner-centered model, making education more interactive, personalized, and effective.
                        </p>
                        <p>
                            We believe that class time is best used for active learning and collaboration, not passive lectures. FlipSpace provides the tools to make this a reality.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Card className="paper-shadow h-full">
                    <CardHeader>
                        <CardTitle className="font-serif text-2xl flex items-center gap-3"><Eye className="h-6 w-6 text-primary" /> Our Vision</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>
                            We envision a world where every student has access to a dynamic and supportive learning environment that adapts to their pace and style, fostering a lifelong love for learning.
                        </p>
                        <p>
                            FlipSpace aims to be the leading platform in facilitating this educational transformation globally.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <div className="text-center mb-12">
                <h2 className="font-serif text-3xl">Key Features</h2>
                <p className="text-muted-foreground mt-2">The core pillars of the FlipSpace experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featureCards.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}>
                            <Card className="paper-shadow text-center h-full">
                                <CardHeader>
                                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                                        <Icon className="h-8 w-8 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h3 className="font-serif text-xl mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
      </main>
    </div>
  );
}