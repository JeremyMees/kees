'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Recipe } from '@/types/firebase'
import { Plus } from 'lucide-react'

export default function RecipeForm({
  onAdd,
}: {
  onAdd: (recipe: Omit<Recipe, 'id'>) => void
}) {
  const formSchema = z.object({
    description: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    link: z.url({
      message: 'Invalid URL.',
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      link: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd(values)

    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Name" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Link" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" variant="outline">
          <Plus />
        </Button>
      </form>
    </Form>
  )
}
