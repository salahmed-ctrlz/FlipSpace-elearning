import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, FileCheck, BarChart3, Upload, CheckCircle, TrendingUp, Users, ArrowRight, FilePlus2, UserCheck, Percent, BookCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
    { title: 'Resources Completed', value: `${completedResources}/${totalResources}`, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950/20' },
    { title: 'Overall Progress', value: `${progressPercentage}%`, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
    { title: 'Quizzes Taken', value: quizzesTaken, icon: FileCheck, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950/20' },
  ];

  const teacherStats = [
    { title: 'Total Resources', value: totalResources, icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
    { title: 'Total Resource Views', value: totalViews, icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950/20' },
    { title: 'Total Completions', value: totalCompletions, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950/20' },
  ];

  const teacherCards = [
    {
      title: 'Upload Resources',
      description: 'Add new learning materials for your students',
      icon: Upload,
      link: '/resources',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Create Assessments',
      description: 'Design new quizzes and tests for your students',
      icon: FilePlus2,
      link: '/assessments',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      title: 'View Analytics',
      description: 'Monitor student engagement and progress',
      icon: BarChart3,
      link: '/analytics',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Manage Discussions',
      description: 'Engage with students and answer questions',
      icon: MessageSquare,
      link: '/forum',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
  ];

  const studentCards = [
    {
      title: 'Browse Resources',
      description: 'Access course materials and videos',
      icon: BookOpen,
      link: '/resources',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Take Assessments',
      description: 'Complete quizzes and test your knowledge',
      icon: FileCheck,
      link: '/assessments',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Join Discussions',
      description: 'Ask questions and collaborate with peers',
      icon: MessageSquare,
      link: '/forum',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
  ];

  const cards = isTeacher ? teacherCards : studentCards;

  // Fake data for student progress presentation
  const studentProgressData = [
    { id: 'stat1', name: 'Students Enrolled', value: 32, icon: UserCheck, progress: null },
    { id: 'stat2', name: 'Average Course Progress', value: 78, icon: TrendingUp, progress: 78 },
    { id: 'stat3', name: 'Homeworks Returned', value: 92, icon: BookCheck, progress: 92 },
    { id: 'stat4', name: 'Average Quiz Score', value: 85, icon: Percent, progress: 85 },
  ];


  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Header Section */}
        <motion.div {...fadeIn} className="mb-16">
          <div className="space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Welcome back, <span className="text-primary">{user.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              {isTeacher
                ? 'Manage your course and track student progress'
                : 'Continue your learning journey'}
            </p>
          </div>
        </motion.div>

        {/* Quick Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <div className="mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-2">
              At a Glance
            </h2>
            <p className="text-muted-foreground text-sm">
              Your performance summary
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isTeacher ? teacherStats : studentStats).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="paper-shadow hover:paper-shadow-lifted transition-all duration-300 h-full">
                    <CardHeader className="pb-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <CardDescription className="text-sm font-medium">
                          {stat.title}
                        </CardDescription>
                        <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                      <div>
                        <p className="text-4xl font-bold font-serif tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Student Progress Section (Teacher only) */}
        {isTeacher && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                Student Progress Overview
              </h2>
              <p className="text-muted-foreground text-sm">
                A quick look at your students' performance.
              </p>
            </div>
            <Card className="paper-shadow">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {studentProgressData.map((student, index) => (
                    <motion.div key={student.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-3 w-full sm:w-48 shrink-0">
                          <student.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium truncate">{student.name}</span>
                        </div>
                        {student.progress !== null ? (
                          <div className="flex-1 w-full">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-semibold">{student.value}%</span>
                            </div>
                            <Progress value={student.value} className="h-2" />
                          </div>
                        ) : (
                          <div className="flex-1 text-left sm:text-right">
                            <span className="text-2xl font-bold font-serif">{student.value}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              students
                            </span>
                          </div>
                        )}
                      </div>
                      {index < studentProgressData.length - 1 && <hr className="mt-6 border-border/50" />}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}


        {/* Quick Links Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-2">
              Quick Actions
            </h2>
            <p className="text-muted-foreground text-sm">
              Get started with these key features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Link to={card.link} className="block h-full">
                    <Card className="paper-shadow hover:paper-shadow-lifted transition-all duration-300 group cursor-pointer h-full border-border/60 hover:border-primary/30">
                      <CardHeader className="space-y-6 pb-4">
                        <div className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-7 w-7 ${card.color}`} />
                        </div>
                        <div className="space-y-3">
                          <CardTitle className="font-serif text-xl font-semibold group-hover:text-primary transition-colors">
                            {card.title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {card.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <Button 
                          variant="outline" 
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                        >
                          <span>Get Started</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </main>
    </div>
  );
}