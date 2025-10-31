import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, BookOpen, CheckCircle, TrendingUp, Download, Info, ShieldAlert } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/api-mock';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: any[];
}

export default function Analytics() {
  const { user, isTeacher } = useAuth();
  const navigate = useNavigate();
  const { resources, logActivity, getUserProgress, getUserQuizAttempts } = useData();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('collective');
  const [sections, setSections] = useState({
    summary: true,
    resourceEngagement: true,
    assessmentPerformance: true,
    personalizedFeedback: true,
    overallSummary: true,
  });

  useEffect(() => {
    if (user && !isTeacher) {
      navigate('/');
    }
  }, [user, isTeacher, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [fetchedUsers, fetchedQuizzes] = await Promise.all([
          api.fetchUsers(),
          api.fetchQuizzes()
        ]);
        setUsers(fetchedUsers || []);
        setQuizzes(fetchedQuizzes || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isTeacher) {
      loadData();
    }
  }, [isTeacher, toast]);

  if (!isTeacher || !user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate analytics
  const totalResources = resources.length;
  const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);
  const totalCompletions = resources.reduce((sum, r) => sum + (r.completions || 0), 0);
  const avgCompletionRate =
    totalViews > 0 ? Math.round((totalCompletions / totalViews) * 100) : 0;

  // Resource engagement data
  const resourceData = resources.map((r) => ({
    name: r.title.length > 20 ? r.title.substring(0, 20) + '...' : r.title,
    views: r.views || 0,
    completions: r.completions || 0,
  }));

  // Weekly trend (mock data)
  const weeklyData = [
    { week: 'Week 1', engagement: 45 },
    { week: 'Week 2', engagement: 62 },
    { week: 'Week 3', engagement: 78 },
    { week: 'Week 4', engagement: 85 },
  ];

  const stats = [
    {
      title: 'Total Resources',
      value: totalResources,
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Total Views',
      value: totalViews,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Completions',
      value: totalCompletions,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Avg. Completion Rate',
      value: `${avgCompletionRate}%`,
      icon: TrendingUp,
      color: 'text-amber-600',
    },
  ];

  const handleSectionChange = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const reportTitle = reportType === 'collective' ? 'Collective Analytics Report' : 'Individual Student Reports';
      addHeader(doc, reportTitle, user.name);

      if (reportType === 'collective') {
        generateCollectiveReport(doc);
      } else {
        generateIndividualReports(doc);
      }

      addFooter(doc);
      doc.save(`FlipSpace_${reportType}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      logActivity(user.id, 'downloaded_report', { reportName: reportTitle, sections: Object.keys(sections).filter(s => sections[s as keyof typeof sections]) });

      toast({
        title: 'PDF Downloaded',
        description: 'Analytics report has been downloaded successfully.',
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast({
        title: 'Download Failed',
        description: 'Failed to generate PDF report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const generateCollectiveReport = (doc: jsPDF) => {
    let finalY = 50;

    if (sections.summary) {
      finalY = addSummarySection(doc, finalY);
      finalY += 10;
    }
    if (sections.resourceEngagement) {
      finalY = addResourceEngagementSection(doc, finalY);
      finalY += 10;
    }
    if (sections.assessmentPerformance) {
      finalY = addCollectiveAssessmentSection(doc, finalY);
      finalY += 10;
    }
    if (sections.overallSummary) {
      finalY = addOverallSummarySection(doc, finalY);
    }
  };

  const generateIndividualReports = (doc: jsPDF) => {
    const students = users.filter(u => u.role === 'student');
    students.forEach((student, index) => {
      if (index > 0) {
        doc.addPage();
      }
      addHeader(doc, `Individual Report: ${student.name}`, user.name);
      let finalY = 50;

      if (sections.summary) {
        const studentProgress = getUserProgress(student.id);
        const completedResources = studentProgress.completed.length;
        const progressPercentage = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;
        const studentQuizAttempts = Object.values(getUserQuizAttempts(student.id)).flat();
        const quizzesTaken = new Set(studentQuizAttempts.map((a: any) => a.quizId)).size;
        const studentStats = [
          ['Resources Completed', `${completedResources}/${totalResources}`],
          ['Overall Progress', `${progressPercentage}%`],
          ['Quizzes Taken', quizzesTaken.toString()],
        ];
        finalY = addSection(doc, 'Summary', [['Metric', 'Value']], studentStats, finalY);
        finalY += 10;
      }

      if (sections.resourceEngagement) {
        const studentProgress = getUserProgress(student.id);
        const resourceDataStudent = resources.map(r => [
          r.title,
          studentProgress.completed.includes(r.id) ? 'Completed' : 'Not Completed',
        ]);
        finalY = addSection(doc, 'Resource Engagement', [['Resource', 'Status']], resourceDataStudent, finalY);
        finalY += 10;
      }

      if (sections.assessmentPerformance) {
        const studentQuizAttempts = getUserQuizAttempts(student.id);
        const quizData = quizzes.map(q => {
          const attempts = (studentQuizAttempts[q.id] || []) as any[];
          const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a: any) => a.score || 0)) : 0;
          const scorePercentage = q.questions.length > 0 && bestScore > 0 
            ? `${Math.round((bestScore / q.questions.length) * 100)}%` 
            : attempts.length > 0 ? '0%' : 'N/A';
          return [q.title, attempts.length.toString(), scorePercentage];
        });
        finalY = addSection(doc, 'Assessment Performance', [['Quiz', 'Attempts', 'Best Score']], quizData, finalY);
        finalY += 10;
      }

      if (sections.personalizedFeedback) {
        const feedback = generateSimulatedFeedback(student);
        finalY = addTextSection(doc, 'Personalized Feedback', feedback, finalY);
      }
    });
  };

  const generateSimulatedFeedback = (student: User) => {
    const studentProgress = getUserProgress(student.id);
    const progressPercentage = totalResources > 0 ? Math.round((studentProgress.completed.length / totalResources) * 100) : 0;
    const studentQuizAttempts = Object.values(getUserQuizAttempts(student.id)).flat();
    const avgScore = studentQuizAttempts.length > 0
      ? studentQuizAttempts.reduce((acc, a: any) => acc + (a.percentage || 0), 0) / studentQuizAttempts.length
      : 0;
  
    // Simulated detailed data
    const timeSpent = (studentProgress.completed.length * 15 + studentProgress.completed.length * 5) + (Math.random() * 100);
    const peerAvgProgress = 65;
    const peerAvgScore = 75;

    let feedback: any[] = [];
    feedback.push({ text: `Personalized Feedback Report for: ${student.name}`, styles: { fontStyle: 'bold', fontSize: 13 } });
    feedback.push({ text: `Generated on: ${new Date().toLocaleDateString()}`, styles: { fontSize: 9, textColor: 120 } });
    feedback.push({ text: '', styles: {} });
  
    if (progressPercentage > 80 && avgScore > 85) {
      feedback.push({ text: 'Overall Assessment: Excellent', styles: { fontStyle: 'bold', fontSize: 12 } });
      feedback.push(`Your dedication is clear with a ${progressPercentage}% resource completion rate and an outstanding average quiz score of ${avgScore.toFixed(0)}%. This places you in the top 10% of the class. Your total engagement time is approximately ${Math.round(timeSpent / 60)} hours.`);
      feedback.push({ text: '', styles: {} });
      feedback.push({ text: 'Recommendations:', styles: { fontStyle: 'bold' } });
      feedback.push('• To challenge yourself further, consider exploring the supplementary materials for modules you found most interesting.');
      feedback.push('• Engage in the forum by answering questions from your peers to solidify your own understanding.');
    } else if (progressPercentage > 50 && avgScore > 70) {
      feedback.push({ text: 'Overall Assessment: Great Progress', styles: { fontStyle: 'bold', fontSize: 12 } });
      feedback.push(`You are making solid progress with a resource completion rate of ${progressPercentage}% and a good average quiz score of ${avgScore.toFixed(0)}%. This is above the class average of ${peerAvgProgress}%.`);
      feedback.push({ text: '', styles: {} });
      feedback.push({ text: 'Recommendations:', styles: { fontStyle: 'bold' } });
      feedback.push('• Focus on reviewing topics where you scored below 80% to solidify your understanding.');
      feedback.push('• Try to complete at least one more resource this week to stay ahead.');
    } else if (progressPercentage > 50) {
      feedback.push({ text: 'Overall Assessment: Consistent Engagement', styles: { fontStyle: 'bold', fontSize: 12 } });
      feedback.push(`You are keeping up well with the course materials (${progressPercentage}% completion). However, your average quiz score of ${avgScore.toFixed(0)}% suggests a need to focus more on knowledge retention. The class average score is ${peerAvgScore}%.`);
      feedback.push({ text: '', styles: {} });
      feedback.push({ text: 'Recommendations:', styles: { fontStyle: 'bold' } });
      feedback.push('• After viewing a resource, take a moment to summarize the key points before attempting the quiz.');
      feedback.push('• Re-attempt quizzes where you scored below 70% to reinforce the concepts.');
    } else if (avgScore > 70) {
      feedback.push({ text: 'Overall Assessment: Good Understanding, Needs More Engagement', styles: { fontStyle: 'bold', fontSize: 12 } });
      feedback.push(`You have a good grasp of the material you've studied, with an average quiz score of ${avgScore.toFixed(0)}%. To improve, focus on increasing your resource completion rate, which is currently at ${progressPercentage}%.`);
      feedback.push({ text: '', styles: {} });
      feedback.push({ text: 'Recommendations:', styles: { fontStyle: 'bold' } });
      feedback.push('• Set a weekly goal to complete 2-3 new resources.');
      feedback.push('• Review the "Resources" page to identify materials you may have missed.');
    } else {
      feedback.push({ text: 'Overall Assessment: Action Recommended', styles: { fontStyle: 'bold', fontSize: 12 } });
      feedback.push(`Your current progress shows a resource completion rate of ${progressPercentage}% and an average quiz score of ${avgScore.toFixed(0)}%. Let's work together to boost these numbers.`);
      feedback.push({ text: '', styles: {} });
      feedback.push({ text: 'Recommendations:', styles: { fontStyle: 'bold' } });
      feedback.push('• Create a study plan. Start with the first module on the "Resources" page and work through it sequentially.');
      feedback.push('• Please reach out if you are facing any difficulties. We are here to help you succeed.');
    }
  
    const difficultQuizzes = quizzes.map(q => {
      const attempts = (getUserQuizAttempts(student.id)[q.id] || []) as any[];
      const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage || 0)) : -1;
      return { title: q.title, bestScore };
    }).filter(q => q.bestScore !== -1 && q.bestScore < 60);
  
    if (difficultQuizzes.length > 0) {
      feedback.push({ text: '', styles: {} });
      feedback.push({ text: 'Specific Areas for Improvement:', styles: { fontStyle: 'bold' } });
      feedback.push(`• It looks like you found the "${difficultQuizzes[0].title}" quiz challenging. I recommend reviewing the associated resources for that topic again. Practice makes perfect!`);
    }
  
    return feedback;
  };

  const addHeader = (doc: jsPDF, title: string, generatedFor: string) => {
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add colored header bar
    doc.setFillColor(0, 78, 137);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 14, 15);
    
    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated for: ${generatedFor}`, 14, 23);
    doc.text(`Date: ${currentDate}`, pageWidth - 14, 23, { align: 'right' });
    
    // Add FlipSpace branding
    doc.setFontSize(8);
    doc.text('FlipSpace Analytics', 14, 30);
  };

  const addFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
      
      // Footer text
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
      doc.text('FlipSpace © 2025', 14, pageHeight - 12);
      doc.text('Confidential', pageWidth - 14, pageHeight - 12, { align: 'right' });
    }
  };

  const addSection = (doc: jsPDF, title: string, head: any[], body: any[], startY: number) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = startY > pageHeight - 50 ? (doc.addPage(), 50) : startY;
    
    // Section title with background
    doc.setFillColor(240, 240, 240);
    doc.rect(14, y, doc.internal.pageSize.getWidth() - 28, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 78, 137);
    doc.text(title, 17, y + 7);
    
    // Table
    autoTable(doc, {
      startY: y + 12,
      head,
      body,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 78, 137],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [50, 50, 50]
      },
      alternateRowStyles: {
        fillColor: [249, 249, 249]
      },
      margin: { left: 14, right: 14 },
      styles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      }
    });
    
    return (doc as any).lastAutoTable.finalY;
  };

  const addTextSection = (doc: jsPDF, title: string, textLines: (string | { text: string, styles: any })[], startY: number) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = startY > pageHeight - 70 ? (doc.addPage(), 50) : startY;
    
    // Section title with background
    doc.setFillColor(240, 240, 240);
    doc.rect(14, y, pageWidth - 28, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 78, 137);
    doc.text(title, 17, y + 7);
    
    let currentY = y + 18;
    const maxWidth = pageWidth - 28;
    
    textLines.forEach(line => {
      // Check if we need a new page
      if (currentY > pageHeight - 30) {
        doc.addPage();
        currentY = 50;
      }
      
      if (typeof line === 'string') {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const splitText = doc.splitTextToSize(line, maxWidth);
        doc.text(splitText, 14, currentY);
        currentY += (splitText.length * 5) + 3;
      } else {
        doc.setFont('helvetica', line.styles.fontStyle || 'normal');
        doc.setFontSize(line.styles.fontSize || 10);
        doc.setTextColor(line.styles.textColor || 60);
        const splitText = doc.splitTextToSize(line.text, maxWidth);
        doc.text(splitText, 14, currentY);
        currentY += (splitText.length * 5) + 3;
      }
    });
    
    return currentY + 5;
  };

  const addSummarySection = (doc: jsPDF, startY: number) => {
    const summaryData = stats.map(stat => [stat.title, String(stat.value)]);
    return addSection(doc, 'Summary Statistics', [['Metric', 'Value']], summaryData, startY);
  };

  const addResourceEngagementSection = (doc: jsPDF, startY: number) => {
    const resourceTableData = resources.map(r => [
      r.title,
      String(r.views || 0),
      String(r.completions || 0),
      r.views && r.views > 0 ? `${Math.round(((r.completions || 0) / r.views) * 100)}%` : '0%',
    ]);
    return addSection(doc, 'Resource Engagement Details', [['Resource', 'Views', 'Completions', 'Completion Rate']], resourceTableData, startY);
  };

  const addCollectiveAssessmentSection = (doc: jsPDF, startY: number) => {
    const students = users.filter(u => u.role === 'student');
    const quizData = quizzes.map(q => {
      let totalAttempts = 0;
      let totalPasses = 0;
      students.forEach(s => {
        const attempts = (getUserQuizAttempts(s.id)[q.id] || []) as any[];
        totalAttempts += attempts.length;
        if (attempts.some(a => (a.percentage || 0) >= 70)) {
          totalPasses++;
        }
      });
      const passRate = students.length > 0 ? `${Math.round((totalPasses / students.length) * 100)}%` : '0%';
      return [q.title, String(totalAttempts), passRate];
    });
    return addSection(doc, 'Collective Assessment Performance', [['Quiz', 'Total Attempts', 'Pass Rate (≥70%)']], quizData, startY);
  };

  const addOverallSummarySection = (doc: jsPDF, startY: number) => {
    const students = users.filter(u => u.role === 'student');
    const totalStudents = students.length;
    const overallProgress = students.reduce((acc, s) => {
      const progress = getUserProgress(s.id);
      return acc + (totalResources > 0 ? progress.completed.length / totalResources : 0);
    }, 0);
    const avgProgress = totalStudents > 0 ? Math.round((overallProgress / totalStudents) * 100) : 0;

    const summaryText: any[] = [
      { text: 'Class Overview', styles: { fontStyle: 'bold', fontSize: 12 } },
      { text: '', styles: {} },
      `The class of ${totalStudents} students shows an average resource completion rate of ${avgProgress}%. Overall resource views stand at ${totalViews}, with ${totalCompletions} total completions.`,
      { text: '', styles: {} },
      { text: 'Key Insights:', styles: { fontStyle: 'bold' } },
      `• ${totalStudents} active students enrolled in the course`,
      `• Average completion rate of ${avgCompletionRate}% across all resources`,
      `• ${totalResources} learning resources available`,
      { text: '', styles: {} },
      { text: 'Recommendations:', styles: { fontStyle: 'bold' } },
      '• Encourage students with lower completion rates to follow a more structured learning path.',
      '• Consider creating supplementary materials for topics with lower engagement.',
      '• Recognize and acknowledge high-achieving students to motivate the class.',
      '• Schedule review sessions for quizzes with lower pass rates.',
    ];

    return addTextSection(doc, 'Overall Summary & Recommendations', summaryText, startY);
  };

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...fadeIn}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl mb-4">Analytics Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Monitor student engagement and course performance
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shrink-0">
                  <Download className="h-4 w-4" />
                  Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Generate Analytics Report</DialogTitle>
                  <DialogDescription>
                    Select the type of report and the sections you want to include.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-3">
                    <Label>Report Type</Label>
                    <RadioGroup defaultValue="collective" value={reportType} onValueChange={setReportType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="collective" id="r1" />
                        <Label htmlFor="r1">Collective Report & Overall Summary</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="r2" />
                        <Label htmlFor="r2">Individual Student Reports</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <Label>Sections to Include</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="summary" checked={sections.summary} onCheckedChange={() => handleSectionChange('summary')} />
                      <Label htmlFor="summary">Summary Statistics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="resource" checked={sections.resourceEngagement} onCheckedChange={() => handleSectionChange('resourceEngagement')} />
                      <Label htmlFor="resource">Resource Engagement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="assessment" checked={sections.assessmentPerformance} onCheckedChange={() => handleSectionChange('assessmentPerformance')} />
                      <Label htmlFor="assessment">Quiz & Assessment Performance</Label>
                    </div>
                    {reportType === 'individual' && (
                      <div className="flex items-center space-x-2 pl-4">
                        <Checkbox id="feedback" checked={sections.personalizedFeedback} onCheckedChange={() => handleSectionChange('personalizedFeedback')} />
                        <Label htmlFor="feedback">Simulated Personalized Feedback</Label>
                      </div>
                    )}
                    {reportType === 'collective' && (
                       <div className="flex items-center space-x-2">
                        <Checkbox id="overallSummary" checked={sections.overallSummary} onCheckedChange={() => handleSectionChange('overallSummary')} />
                        <Label htmlFor="overallSummary">Overall Summary & Recommendations</Label>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={generatePDF} className="gap-2">
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="paper-shadow">
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
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="paper-shadow">
              <CardHeader>
                <CardTitle className="font-serif">Resource Engagement</CardTitle>
                <CardDescription>Views and completions per resource</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resourceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" />
                    <Bar dataKey="completions" fill="hsl(var(--secondary))" name="Completions" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground pt-4">
                  This chart illustrates student interaction with each resource. "Views" represent the number of times a resource has been accessed, while "Completions" track how many students have marked it as complete.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="paper-shadow">
              <CardHeader>
                <CardTitle className="font-serif">Engagement Trend</CardTitle>
                <CardDescription>Overall engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Engagement %"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground pt-4">
                  This trend line shows the overall student engagement percentage over the past four weeks, providing a high-level view of participation trends over time.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Important Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Alert className="bg-background/50 border-border/60">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle className="font-semibold">Important Information</AlertTitle>
            <AlertDescription className="mt-2 space-y-3 text-muted-foreground text-xs">
              <p>
                <strong className="text-foreground/90">Confidentiality Notice:</strong> The analytics data presented on this dashboard is confidential and intended for authorized academic use only. Please refrain from sharing or distributing student performance metrics.
              </p>
              <p>
                <strong className="text-foreground/90">Data Refresh:</strong> Statistics are updated periodically. There may be a slight delay between student actions and their reflection in these reports. For real-time data, please allow a few moments for the system to process.
              </p>
              <p>
                <strong className="text-foreground/90">Purpose:</strong> This dashboard is designed to provide insights into student engagement and help identify areas where additional support may be needed.
              </p>
            </AlertDescription>
          </Alert>
        </motion.div>
      </main>
    </div>
  );
}