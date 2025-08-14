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
import { Food } from '@/types/firebase'
import { Plus } from 'lucide-react'

export default function FoodForm({
  onAdd,
}: {
  onAdd: (food: Omit<Food, 'id'>) => void
}) {
  const formSchema = z.object({
    item: z.string().min(2, {
      message: 'Item must be at least 2 characters.',
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd({ item: values.item, quantity: 1 })

    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="item"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Kaas" {...field} autoComplete="off" />
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
