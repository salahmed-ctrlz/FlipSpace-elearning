import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, ExternalLink, Check, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ResourceCardProps {
  resource: any;
  showProgress?: boolean;
}

export const ResourceCard = ({ resource, showProgress = false }: ResourceCardProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const { user, isTeacher } = useAuth();
  const { markComplete, markViewed, getUserProgress, deleteResource } = useData();
  const { toast } = useToast();

  const progress = user ? getUserProgress(user.id) : { completed: [], views: [] };
  const isCompleted = progress.completed.includes(resource.id);
  const isViewed = progress.views.includes(resource.id);

  const handleView = async () => {
    setShowPreview(true);
    if (user && !isViewed) {
      await markViewed(user.id, resource.id);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    await markComplete(user.id, resource.id);
    toast({
      title: 'Resource completed!',
      description: `You've marked "${resource.title}" as complete.`,
    });
  };

  const handleDelete = async () => {
    if (!user || !isTeacher) return;
    await deleteResource(resource.id);
    toast({
      title: 'Resource Deleted',
      description: `"${resource.title}" has been removed.`,
    });
  };

  const getIcon = () => {
    switch (resource.type) {
      case 'video':
        return <Video className="h-5 w-5 text-primary" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-primary" />;
      default:
        return <ExternalLink className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <>
      <Card className="paper-shadow hover:paper-shadow-lifted transition-all duration-300 group">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">{getIcon()}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {resource.module}
                  </Badge>
                  {isCompleted && (
                    <Badge className="text-xs bg-green-600 hover:bg-green-700">
                      <Check className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  {isViewed && !isCompleted && (
                    <Badge variant="outline" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Viewed
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-serif text-lg group-hover:text-primary transition-colors">
                  {resource.title}
                </CardTitle>
                {resource.description && (
                  <CardDescription className="mt-2">
                    {resource.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button onClick={handleView} size="sm">
              View Resource
            </Button>
            {showProgress && !isCompleted && (
              <Button onClick={handleComplete} size="sm" variant="outline">
                Mark Complete
              </Button>
            )}
            {isTeacher && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><AlertTriangle />Confirm Deletion</DialogTitle>
                    <DialogDescription className="pt-2">
                      Are you sure you want to delete the resource "{resource.title}"? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>Delete Resource</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {showProgress && (
            <div className="mt-4 text-xs text-muted-foreground">
              <span>{resource.views || 0} views</span>
              <span className="mx-2">•</span>
              <span>{resource.completions || 0} completions</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-serif">{resource.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {resource.type === 'video' && (
              <div className="aspect-video">
                <iframe
                  src={resource.url}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={resource.title}
                />
              </div>
            )}
            {resource.type === 'pdf' && (
              resource.url.startsWith('data:application/pdf') ? (
                <iframe
                  src={resource.url}
                  className="w-full h-[70vh] rounded-lg border"
                  title={resource.title}
                />
              ) : (
                <div className="h-[70vh] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">PDF preview not available for external links.</p>
                    <Button asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open PDF in New Tab
                      </a>
                    </Button>
                  </div>
                </div>
              )
            )}
            {resource.description && (
              <p className="mt-4 text-sm text-muted-foreground">
                {resource.description}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
