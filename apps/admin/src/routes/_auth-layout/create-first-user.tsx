import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, signUpSchema } from '@nexcom/validators'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import { Eye, EyeOff, Loader2, MoveRight } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@nexcom/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nexcom/ui/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@nexcom/ui/components/ui/form'
import { Input } from '@nexcom/ui/components/ui/input'
import type { SignUpInput } from '@nexcom/validators'
import { z } from 'zod'
import { api, trpcQueryUtils } from '~/router'

export const Route = createFileRoute('/_auth-layout/create-first-user')({
  component: () => <SignUpForm />,
  validateSearch: zodSearchValidator(
    z.object({ callbackUrl: z.string().default('/') }),
  ),
})

function SignUpForm() {
  const navigate = useNavigate()
  const router = useRouter()

  const { callbackUrl } = Route.useSearch()

  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate, isPending } = api.auth.createFirstUser.useMutation({
    onSuccess: async () => {
      toast.success('Account created', {
        description: 'You are now signed in',
      })
      await trpcQueryUtils.auth.getUser.invalidate()
      router.invalidate()
      await navigate({ to: callbackUrl })
    },
    onError: (err) => setError(err.message)
  })

  const onSubmit = (values: SignUpInput) => {
    mutate(values)
  }

  return (
    <Card className="w-full max-w-[25rem]">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl">Create the first user</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Muhammad Isa"
                      onChange={(value) => {
                        field.onChange(value)
                        setError('')
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="email@example.com"
                      type="email"
                      onChange={(value) => {
                        field.onChange(value)
                        setError('')
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(value) => {
                          field.onChange(value)
                          setError('')
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff
                            className="size-4 text-muted-foreground transition-all hover:text-primary"
                            aria-hidden="true"
                          />
                        ) : (
                          <Eye
                            className="size-4 text-muted-foreground transition-all hover:text-primary"
                            aria-hidden="true"
                          />
                        )}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(value) => {
                          field.onChange(value)
                          setError('')
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff
                            className="size-4 text-muted-foreground transition-all hover:text-primary"
                            aria-hidden="true"
                          />
                        ) : (
                          <Eye
                            className="size-4 text-muted-foreground transition-all hover:text-primary"
                            aria-hidden="true"
                          />
                        )}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            {error || Object.keys(form.formState.errors).length > 0 ? (
              <ul className="list-disc space-y-1 rounded-lg border border-destructive/20 bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
                {form.formState.errors ? (
                  <>
                    {Object.values(form.formState.errors).map(
                      ({ message }, idx) => (
                        <li className="ml-4" key={idx}>
                          {message}
                        </li>
                      ),
                    )}
                  </>
                ) : null}
                {error ? <li className="ml-4">{error}</li> : null}
              </ul>
            ) : null}
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  <span>Processing</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <MoveRight className="ml-2 size-4" />
                </>
              )}
            </Button>
            <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            <Button
              variant="secondary"
              type="button"
              className="border-2"
              onClick={() => toast.info('Yet to be implemented.')}
            >
              Continue with Google
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
