import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, BookOpen, CheckCircle, TrendingUp, Download, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '@/hooks/use-toast';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Analytics() {
  const { user, isTeacher } = useAuth();
  const navigate = useNavigate();
  const { resources, logActivity } = useData();

  useEffect(() => {
    if (!isTeacher) {
      navigate('/');
    }
  }, [isTeacher, navigate]);

  if (!isTeacher || !user) return null;

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

  const { toast } = useToast();

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

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      });
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(0, 78, 137); // --primary color
      doc.text('FlipSpace Analytics Report', 14, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(85, 85, 85); // --muted-foreground
      doc.text(`Generated for: ${user.name}`, 14, 30);
      doc.text(`Date: ${currentDate}`, pageWidth - 14, 30, { align: 'right' });

      doc.setDrawColor(224, 221, 213); // --border
      doc.line(14, 35, pageWidth - 14, 35);

      // Summary Stats
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(30, 30, 30); // --foreground
      doc.text('Summary Statistics', 14, 45);
      
      const summaryData = stats.map(stat => [
        stat.title,
        typeof stat.value === 'number' ? stat.value.toString() : stat.value
      ]);

      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [0, 78, 137] },
      });

      // Resource Engagement Table
      const finalY = (doc as any).lastAutoTable.finalY || 80;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Resource Engagement Details', 14, finalY + 15);

      const resourceTableData = resources.map(r => [
        r.title,
        (r.views || 0).toString(),
        (r.completions || 0).toString(),
        r.views ? `${Math.round((r.completions / r.views) * 100)}%` : '0%'
      ]);

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Resource', 'Views', 'Completions', 'Rate']],
        body: resourceTableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 78, 137] },
      });

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('FlipSpace © 2025', 14, pageHeight - 10);
      }

      // Save the PDF
      doc.save(`FlipSpace_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Log activity
      logActivity(user.id, 'downloaded_report', { reportName: 'Analytics Report' });

      toast({
        title: 'PDF Downloaded',
        description: 'Analytics report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to generate PDF report. Please try again.',
        variant: 'destructive',
      });
    }
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
            <Button onClick={downloadPDF} className="gap-2 shrink-0">
              <Download className="h-4 w-4" />
              Download PDF Report
            </Button>
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
