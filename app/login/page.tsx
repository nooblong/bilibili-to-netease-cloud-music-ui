import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            This demo uses GitHub for authentication.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form
            action={async (formData) => {
              'use server';
              try {
                await signIn('credentials', formData);
              } catch (error) {
                if (error instanceof AuthError) throw error;
              }
            }}
            className="w-full"
          >
            <Label>
              Username
              <Input name="username" type="text" />
            </Label>
            <Label>
              Password
              <Input name="password" type="password" />
            </Label>
            <Button>Sign In</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
