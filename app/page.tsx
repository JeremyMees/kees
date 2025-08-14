'use client'

import { foodsCollection, create, update, remove } from '@/lib/firebase.browser'
import { onSnapshot } from 'firebase/firestore'
import { Food } from '@/types/firebase'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import FoodForm from '@/components/Forms/Food'
import { useEffect, useState } from 'react'
import { NumberInput } from '@/components/ui/number-input'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function Page() {
  const [foods, setFoods] = useState<Food[]>([])
  const [list] = useAutoAnimate()

  useEffect(() => {
    const unsubscribe = onSnapshot(foodsCollection, (querySnapshot) => {
      setFoods(
        querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => a.item.localeCompare(b.item))
      )
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="flex flex-col gap-6 content pt-2 max-h-full overflow-y-auto">
      <FoodForm onAdd={(food) => create(foodsCollection, food)} />
      <ul ref={list} className="flex flex-col pb-8 overflow-y-auto">
        {foods.map((food) => (
          <li
            key={food.id}
            className="grid grid-cols-3 items-center gap-2 border-b text-sm py-1"
          >
            <NumberInput
              value={food.quantity}
              min={1}
              max={100}
              onValueChange={(value) =>
                update(foodsCollection, food.id, { quantity: value ?? 1 })
              }
            />
            <span className="font-semibold min-w-7">{food.item}</span>
            <Button
              variant="ghost"
              size="icon"
              className="justify-self-end"
              onClick={() => remove(foodsCollection, food.id)}
            >
              <X />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
