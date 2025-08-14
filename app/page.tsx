'use client'

import { foodsCollection, create, update, remove } from '@/lib/firebase.browser'
import { onSnapshot } from 'firebase/firestore'
import { Food } from '@/types/firebase'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { X } from 'lucide-react'
import FoodForm from '@/components/Forms/Food'
import { useEffect, useState } from 'react'
import { NumberInput } from '@/components/ui/number-input'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function Page() {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [list] = useAutoAnimate()

  useEffect(() => {
    const unsubscribe = onSnapshot(foodsCollection, (querySnapshot) => {
      setFoods(
        querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => a.item.localeCompare(b.item))
      )
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="flex flex-col gap-6 content pt-2 max-h-full overflow-y-auto">
      <FoodForm onAdd={(food) => create(foodsCollection, food)} />
      <ul ref={list} className="flex flex-col pb-8 overflow-y-auto">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <FoodSkeleton key={i} />)
          : foods.map((food) => <FoodItem key={food.id} food={food} />)}
      </ul>
    </div>
  )
}

function FoodItem({ food }: { food: Food }) {
  return (
    <li className="grid grid-cols-7 items-center gap-2 border-b text-sm py-1">
      <NumberInput
        value={food.quantity}
        min={1}
        max={100}
        className="col-span-2"
        onValueChange={(value) =>
          update(foodsCollection, food.id, { quantity: value ?? 1 })
        }
      />
      <span className="font-semibold text-ellipsis line-clamp-1 col-span-4">
        {food.item}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="justify-self-end"
        onClick={() => remove(foodsCollection, food.id)}
      >
        <X />
      </Button>
    </li>
  )
}

function FoodSkeleton() {
  return (
    <li className="grid grid-cols-7 items-center gap-2 border-b text-sm py-1">
      <Skeleton className="w-[75px] h-[26px] col-span-2" />
      <Skeleton className="w-full h-5 col-span-4" />
      <Skeleton className="size-9 justify-self-end" />
    </li>
  )
}
