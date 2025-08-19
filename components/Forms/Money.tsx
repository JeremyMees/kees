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
import { Money } from '@/types/firebase'
import { Plus } from 'lucide-react'

export default function MoneyForm({
  onAdd,
}: {
  onAdd: (money: Omit<Money, 'id'>) => void
}) {
  const formSchema = z.object({
    description: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    quantity: z
      .string()
      .min(1, { message: 'Quantity must be at least 1.' })
      .regex(/^-?\d+(\.\d{1,2})?$/, { message: 'Quantity must be a number.' }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      quantity: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd({
      description: values.description,
      quantity: Number(values.quantity ?? 0),
      date: Date.now(),
    })

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
          name="quantity"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Quantity" {...field} autoComplete="off" />
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
