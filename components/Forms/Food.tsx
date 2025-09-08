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
import {
  RadioGroup,
  RadioGroupTag,
} from "@/components/ui/radio-group"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Food, FoodType } from '@/types/firebase'
import { Plus } from 'lucide-react'

export default function FoodForm({
  onAdd,
}: {
  onAdd: (food: Omit<Food, 'id'>) => void
}) {
  const foodTypes: FoodType[] = ['Other', 'Fridge', 'Freezer', 'Cans', 'Dry Goods', 'Bread']

  const formSchema = z.object({
    item: z.string().min(2, {
      message: 'Item must be at least 2 characters.',
    }),
    type: z.enum(foodTypes),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item: '',
      type: 'Other',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd({
      item: values.item,
      type: values.type,
      quantity: 1,
    })

    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-2">
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
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value)
                  }}
                  value={field.value}
                  className="flex flex-wrap gap-2"
                >
                  {foodTypes.map((type) => (
                    <RadioGroupTag 
                      key={type} 
                      value={type}
                      onClick={() => {
                        form.handleSubmit(onSubmit)()
                      }}
                    >
                      {type}
                    </RadioGroupTag>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
