import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Eye } from 'lucide-react';
import { BlogPost } from '@/api/api';

interface PostCardProps {
  post: BlogPost;
}

const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Link to={`/post/${post.id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-card-hover border-0 shadow-md">
        <CardHeader className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.author?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{post.author}</p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{post.createdAt ? formatDate(post.createdAt) : 'Recently'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readTime || '5 min read'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {truncateText(post.title, 80)}
          </h2>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Content Preview */}
          <p className="text-muted-foreground leading-relaxed line-clamp-3">
            {truncateText(post.body, 150)}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Read More */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-primary group-hover:text-primary-dark transition-colors">
              Read more →
            </span>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{Math.floor(Math.random() * 1000) + 100} views</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;