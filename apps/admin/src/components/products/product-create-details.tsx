import { Button } from '@nexcom/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@nexcom/ui/components/card'
import { FormControl, FormField, FormItem, FormLabel, FormInput, FormMessage } from '@nexcom/ui/components/form'
import { Input } from '@nexcom/ui/components/input'
import { Sparkles } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { slugify } from '~/lib/utils'
import Editor from '../editor'
import { useFormContext } from 'react-hook-form'
import { InsertProductInput } from '@nexcom/validators/admin'

export const ProductCreateDetails = () => {
  
  const form = useFormContext<InsertProductInput>()

  const { title } = form.watch()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <FormInput
                    {...field}
                    placeholder="Product title"
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="slug"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="-mb-1 flex items-center justify-between">
                  <FormLabel>Slug</FormLabel>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      if (Boolean(!title)) {
                        toast.info("Please enter a title first")
                        return
                      }
                      field.onChange(slugify(title))
                    }}
                  >
                    <Sparkles className="mr-1.5 size-3 text-muted-foreground" />
                    Auto generate
                  </Button>
                </div>
                <FormControl>
                  <FormInput {...field} autoCorrect="off" spellCheck="false" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Editor {...field} initialValue={field.value ?? {}} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
