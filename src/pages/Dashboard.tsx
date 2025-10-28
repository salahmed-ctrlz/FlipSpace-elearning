import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, FileCheck, BarChart3, Upload, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Dashboard() {
  const { user, isTeacher } = useAuth();
  const { resources, getUserProgress, getUserQuizAttempts } = useData();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Student Stats
  const userProgress = getUserProgress(user.id);
  const completedResources = userProgress.completed.length;
  const totalResources = resources.length;
  const progressPercentage = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;
  const userQuizAttempts = Object.values(getUserQuizAttempts(user.id)).flat();
  const quizzesTaken = new Set(userQuizAttempts.map((a: any) => a.quizId)).size;

  // Teacher Stats
  const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);
  const totalCompletions = resources.reduce((sum, r) => sum + (r.completions || 0), 0);

  const studentStats = [
    { title: 'Resources Completed', value: `${completedResources}/${totalResources}`, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Overall Progress', value: `${progressPercentage}%`, icon: TrendingUp, color: 'text-blue-600' },
    { title: 'Quizzes Taken', value: quizzesTaken, icon: FileCheck, color: 'text-purple-600' },
  ];

  const teacherStats = [
    { title: 'Total Resources', value: totalResources, icon: BookOpen, color: 'text-blue-600' },
    { title: 'Total Resource Views', value: totalViews, icon: Users, color: 'text-purple-600' },
    { title: 'Total Completions', value: totalCompletions, icon: CheckCircle, color: 'text-green-600' },
  ];

  const teacherCards = [
    {
      title: 'Upload Resources',
      description: 'Add new learning materials for your students',
      icon: Upload,
      link: '/resources',
      color: 'text-blue-600',
    },
    {
      title: 'View Analytics',
      description: 'Monitor student engagement and progress',
      icon: BarChart3,
      link: '/analytics',
      color: 'text-green-600',
    },
    {
      title: 'Manage Discussions',
      description: 'Engage with students and answer questions',
      icon: MessageSquare,
      link: '/forum',
      color: 'text-purple-600',
    },
  ];

  const studentCards = [
    {
      title: 'Browse Resources',
      description: 'Access course materials and videos',
      icon: BookOpen,
      link: '/resources',
      color: 'text-blue-600',
    },
    {
      title: 'Take Assessments',
      description: 'Complete quizzes and test your knowledge',
      icon: FileCheck,
      link: '/assessments',
      color: 'text-green-600',
    },
    {
      title: 'Join Discussions',
      description: 'Ask questions and collaborate with peers',
      icon: MessageSquare,
      link: '/forum',
      color: 'text-purple-600',
    },
  ];

  const cards = isTeacher ? teacherCards : studentCards;

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...fadeIn}>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Welcome back, {user.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            {isTeacher
              ? 'Manage your course and track student progress'
              : 'Continue your learning journey'}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="font-serif text-2xl mb-6">At a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(isTeacher ? teacherStats : studentStats).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="paper-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardDescription>{stat.title}</CardDescription>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold font-serif">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        <h2 className="font-serif text-2xl mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Link to={card.link}>
                  <Card className="paper-shadow hover:paper-shadow-lifted transition-all duration-300 group cursor-pointer h-full">
                    <CardHeader>
                      <div className={`mb-4 ${card.color}`}>
                        <Icon className="h-10 w-10" />
                      </div>
                      <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
