'use client'

import { useEffect, useState } from 'react'

import { moneyCollection, create, remove } from '@/lib/firebase.browser'
import { onSnapshot } from 'firebase/firestore'
import { Money } from '@/types/firebase'

import MoneyForm from '@/components/Forms/Money'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { X } from 'lucide-react'

export default function Page() {
  const [money, setMoney] = useState<Money[]>([])
  const [selectedMoney, setSelectedMoney] = useState<Money>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(moneyCollection, (querySnapshot) => {
      setMoney(
        querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => b.date - a.date)
      )
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])
  
  return (
    <div className="flex flex-col gap-6 content pt-2 max-h-full overflow-y-auto">
      <MoneyForm onAdd={(money) => create(moneyCollection, money)} />
      <AlertDialog>
        <div className="flex flex-col gap-2 pb-8">
          <MoneyItems loading={loading} money={money} setSelectedMoney={setSelectedMoney} />
          <MoneyTotal loading={loading} money={money} />
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {selectedMoney?.description}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedMoney(undefined)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedMoney?.id) {
                  remove(moneyCollection, selectedMoney.id)
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function MoneyTotal({ loading, money }: { loading: boolean, money: Money[] }) {
  if (loading) return <Skeleton className="w-17 h-5" />

  if (money.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold w-fit">
        Total: €
        {money.reduce((acc, curr) => acc + Number(curr.quantity), 0)}
      </span>
    </div>
  )
}

function MoneyItems({
  loading,
  money,
  setSelectedMoney,
}: {
  loading: boolean
  money: Money[]
  setSelectedMoney: (money: Money) => void
}) {
  const [list] = useAutoAnimate()

  const listItems = loading
    ? Array.from({ length: 10 }).map((_, i) => <MoneySkeleton key={i} />)
    : money.map((money) => (<MoneyItem key={money.id} money={money} onDelete={() => setSelectedMoney(money)} />))
  
  if (money.length === 0 && !loading) {
    return (
      <span className="w-fit text-muted-foreground mx-auto pt-10">
        No money items found.
      </span>
    )
  }

  return (
    <ul ref={list} className="flex flex-col overflow-y-auto">
      {listItems}
    </ul>
  )
}

function MoneyItem({
  money,
  onDelete,
}: {
  money: Money
  onDelete: () => void
}) {
  return (
    <li className="grid grid-cols-4 items-center gap-2 border-b text-sm py-1">
      <span className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1 w-fit">
        {new Date(money.date).toLocaleDateString('be-BE', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })}
      </span>
      <span className="font-semibold text-ellipsis line-clamp-1">
        €{money.quantity}
      </span>
      <span className="font-semibold text-ellipsis line-clamp-1">
        {money.description}
      </span>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="justify-self-end"
          onClick={onDelete}
        >
          <X />
        </Button>
      </AlertDialogTrigger>
    </li>
  )
}

function MoneySkeleton() {
  return (
    <li className="grid grid-cols-4 items-center gap-2 border-b py-1">
      <Skeleton className="w-17 h-6" />
      <Skeleton className="w-10 h-5" />
      <Skeleton className="w-full h-5" />
      <Skeleton className="size-9 justify-self-end" />
    </li>
  )
}
