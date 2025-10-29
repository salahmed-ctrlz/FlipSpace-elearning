import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/utils/api-mock';

interface DiscussionThreadProps {
  thread: any;
}

export const DiscussionThread = ({ thread }: DiscussionThreadProps) => {
  const [newPost, setNewPost] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { createPost, createReply } = useData();
  const { toast } = useToast();

  const handleCreatePost = async () => {
    if (!user || !newPost.trim()) return;

    setLoading(true);
    try {
      await createPost(thread.id, user.id, user.name, newPost);
      setNewPost('');
      toast({
        title: 'Post created!',
        description: 'Your comment has been added to the discussion.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReply = async (postId: string) => {
    if (!user || !replyText.trim()) return;

    setLoading(true);
    try {
      await createReply(thread.id, postId, user.id, user.name, replyText);
      setReplyText('');
      setReplyTo(null);
      toast({
        title: 'Reply posted!',
        description: 'Your reply has been added.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (

    <div className="space-y-6">
      <Card className="paper-shadow">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {thread.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Posts */}
          {thread.posts.map((post: any) => (
            <div key={post.id} className="space-y-4">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(post.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/profile/${post.author}`} className="font-medium hover:underline">
                      {post.authorName}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                    {api.findUser(post.author)?.role === 'teacher' && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {api.findUser(post.author).role}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{post.text}</p>

                  {/* Replies */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="ml-8 mt-4 space-y-4 border-l-2 border-muted pl-4">
                      {post.replies.map((reply: any) => {
                        const replyAuthor = api.findUser(reply.author);
                        return (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                {getInitials(reply.authorName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link to={`/profile/${reply.author}`} className="font-medium text-sm hover:underline">
                                  {reply.authorName}
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </span>
                                {replyAuthor?.role === 'teacher' && (
                                  <Badge variant="secondary" className="text-xs capitalize">
                                    {replyAuthor.role}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm">{reply.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyTo === post.id ? (
                    <div className="ml-8 mt-4 space-y-2">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCreateReply(post.id)}
                          disabled={!replyText.trim() || loading}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyTo(null);
                            setReplyText('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReplyTo(post.id)}
                      className="mt-2"
                    >
                      Reply
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* New Post Form */}
          <div className="border-t border-border pt-6">
            <div className="space-y-3">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts or ask a question..."
                rows={3}
              />
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.trim() || loading}
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
