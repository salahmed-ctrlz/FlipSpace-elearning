import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { MessageSquare, CheckCircle, HelpCircle, FileText, Video, ExternalLink, FileDown, UserPlus, UserCheck, ShieldAlert, Flag, RefreshCw, AlertTriangle, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/utils/api-mock';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const ResourceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'video': return <Video className="h-4 w-4 text-muted-foreground" />;
    case 'pdf': return <FileText className="h-4 w-4 text-muted-foreground" />;
    default: return <ExternalLink className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function Profile() {
  const { username } = useParams<{ username?: string }>();
  const { user: currentUser, loading: authLoading, isTeacher } = useAuth();
  const { discussions, resources, quizzes, getUserProgress, getUserQuizAttempts, loading: dataLoading, resetProgress } = useData();
  const { toast } = useToast();

  const [profileUser, setProfileUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);

  const isOwnProfile = !username || currentUser?.username === username;
  const navigate = useNavigate();
  const userToFetch = isOwnProfile ? currentUser : { username };

  useEffect(() => {
    if (userToFetch?.username) {
      const userDetails = api.findUser(userToFetch.username);
      setProfileUser(userDetails);
      if (currentUser && userDetails && !isOwnProfile) {
        setIsFollowing(api.isFollowing(currentUser.id, userDetails.id));
        setIsFavorited(api.isFavorited(currentUser.id, userDetails.id));
        setIsBlocked(api.isBlocked(currentUser.id, userDetails.id));
      }
    }
  }, [username, currentUser, isOwnProfile]);

  const handleFollow = () => {
    if (!currentUser || !profileUser) return;
    api.toggleFollow(currentUser.id, profileUser.id);
    setIsFollowing(!isFollowing);
    toast({ title: isFollowing ? `Unfollowed ${profileUser.name}` : `Followed ${profileUser.name}` });
  };

  const handleFavorite = () => {
    if (!currentUser || !profileUser) return;
    api.toggleFavorite(currentUser.id, profileUser.id);
    setIsFavorited(!isFavorited);
    toast({ title: isFavorited ? `Removed ${profileUser.name} from favorites` : `Added ${profileUser.name} to favorites` });
  };

  const handleBlock = () => {
    if (!currentUser || !profileUser) return;
    api.toggleBlock(currentUser.id, profileUser.id);
    setIsBlocked(!isBlocked);
    toast({ title: isBlocked ? `Unblocked ${profileUser.name}` : `Blocked ${profileUser.name}` });
  };

  const handleMessage = () => {
    if (!profileUser) return;
    navigate('/messages', { state: { newConversationUser: profileUser } });
  }

  const handleReport = () => {
    toast({ title: 'Report Submitted', description: 'Thank you for your feedback. Our team will review this report.' });
    setReportReason('');
    setReportDialogOpen(false);
  };

  const handleResetProgress = async () => {
    if (!currentUser) return;
    await resetProgress(currentUser.id);
    toast({
      title: 'Progress Reset',
      description: 'Your course progress has been successfully reset.',
    });
  };

  if (authLoading || dataLoading || !profileUser) {
    return <div className="container mx-auto max-w-[1200px] px-6 py-20"><Skeleton className="h-48 w-full" /></div>;
  }

  // Gather user activities
  const userComments = discussions
    .flatMap(d => d.posts.map(p => ({ ...p, threadTitle: d.title, threadId: d.id })))
    .filter(p => p.author === profileUser.username)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const userProgress = getUserProgress(profileUser.id);
  const completedResources = resources
    .filter(r => userProgress.completed.includes(r.id))
    .sort((a, b) => {
        const aDate = userProgress.completed.find(c => c === a.id) ? new Date() : new Date(0);
        const bDate = userProgress.completed.find(c => c === b.id) ? new Date() : new Date(0);
        return bDate.getTime() - aDate.getTime();
    })
    .slice(0, 5);

  const userQuizAttempts = Object.entries(getUserQuizAttempts(profileUser.id))
    .flatMap(([quizId, attempts]) => 
        (attempts as any[]).map(attempt => ({ ...attempt, quizId, quizTitle: quizzes.find(q => q.id === quizId)?.title || 'Quiz' }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const downloadedReports = (window.localStorage.getItem(`user-activity-${profileUser.id}`) ?
    JSON.parse(window.localStorage.getItem(`user-activity-${profileUser.id}`)!) : [])
    .filter((act: any) => act.type === 'downloaded_report')
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);


  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...fadeIn}>
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {getInitials(profileUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-serif text-4xl md:text-5xl">{profileUser.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">@{profileUser.username}</p>
              <Badge variant="secondary" className="mt-4 capitalize">{profileUser.role}</Badge>
            </div>
            {!isOwnProfile && currentUser && !isBlocked && (
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleMessage} variant="default">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button onClick={handleFollow} variant={isFollowing ? 'outline' : 'default'}>
                  {isFollowing ? <UserCheck className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button onClick={handleFavorite} variant="outline" size="icon" aria-label="Favorite">
                  <Star className={`h-4 w-4 ${isFavorited ? 'fill-yellow-400 text-yellow-500' : ''}`} />
                </Button>
              </div>
            )}
            {!isOwnProfile && currentUser && (
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Dialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Flag className="h-4 w-4" /></Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report {profileUser.name}</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for reporting this user. Your report is anonymous.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Label htmlFor="report-reason">Reason</Label>
                      <Textarea
                        id="report-reason"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder="Describe the issue..."
                      />
                    </div>
                    <Button onClick={handleReport} disabled={!reportReason.trim()}>Submit Report</Button>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" onClick={handleBlock}>
                  <ShieldAlert className="h-4 w-4" />
                  <span className="sr-only">{isBlocked ? 'Unblock' : 'Block'}</span>
                </Button>
              </div>
            )}
            {isBlocked && (
              <div className="w-full md:w-auto text-center md:text-right mt-4 md:mt-0">
                <p className="text-destructive font-medium">You have blocked this user.</p>
                <Button variant="link" onClick={handleBlock} className="text-destructive">Unblock</Button>
              </div>
            )}
          </div>

          {isOwnProfile && !isTeacher && (
            <Card className="paper-shadow mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Student Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="gap-2"><RefreshCw className="h-4 w-4" /> Reset My Progress</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2"><AlertTriangle />Confirm Progress Reset</DialogTitle>
                      <DialogDescription className="pt-2">Are you sure you want to reset all your progress? This will clear all completed and viewed resources. This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild><Button variant="outline">No, Cancel</Button></DialogClose>
                      {/* The DialogClose will close the dialog after the onClick action is completed */}
                      <DialogClose asChild><Button variant="destructive" onClick={handleResetProgress}>Yes, Reset Progress</Button></DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <Card className="paper-shadow">
            <CardHeader>
              <CardTitle className="font-serif">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Recent Comments */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Recent Comments</h3>
                  <Separator />
                  <ul className="mt-4 space-y-3">
                    {userComments.length > 0 ? userComments.map(comment => (
                      <li key={comment.id} className="text-sm">
                        <p>Commented on <Link to={`/forum?thread=${comment.threadId}`} className="font-medium text-primary hover:underline">"{comment.threadTitle}"</Link></p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                      </li>
                    )) : <p className="text-sm text-muted-foreground">No recent comments.</p>}
                  </ul>
                </div>

                {/* Recently Completed Resources */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Recently Completed</h3>
                  <Separator />
                  <ul className="mt-4 space-y-3">
                    {completedResources.length > 0 ? completedResources.map(resource => (
                      <li key={resource.id} className="text-sm flex items-center gap-2">
                        <ResourceIcon type={resource.type} />
                        <p>Completed <span className="font-medium">"{resource.title}"</span></p>
                      </li>
                    )) : <p className="text-sm text-muted-foreground">No completed resources yet.</p>}
                  </ul>
                </div>

                {/* Recent Quiz Attempts */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-secondary" /> Recent Quiz Attempts</h3>
                  <Separator />
                  <ul className="mt-4 space-y-3">
                    {userQuizAttempts.length > 0 ? userQuizAttempts.map(attempt => (
                      <li key={attempt.id} className="text-sm">
                        <p>Attempted <Link to="/assessments" className="font-medium text-primary hover:underline">"{attempt.quizTitle}"</Link> and scored {attempt.percentage}%</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(attempt.timestamp), { addSuffix: true })}</p>
                      </li>
                    )) : <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>}
                  </ul>
                </div>

                {/* Downloaded Reports (Teacher only) */}
                {profileUser.role === 'teacher' && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><FileDown className="h-5 w-5 text-blue-600" /> Downloaded Reports</h3>
                    <Separator />
                    <ul className="mt-4 space-y-3">
                      {downloadedReports.length > 0 ? downloadedReports.map((report: any, index: number) => (
                        <li key={`${report.id}-${index}`} className="text-sm">
                          <p>Downloaded the <span className="font-medium">"{report.details.reportName}"</span></p>
                          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}</p>
                        </li>
                      )) : <p className="text-sm text-muted-foreground">No reports downloaded recently.</p>}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
