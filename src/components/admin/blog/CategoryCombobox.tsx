interface CategoryComboboxProps {
  id?: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

const inputClass =
  'w-full rounded-lg border-2 border-stroke-primary px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary'

export function CategoryCombobox({ id, value, options, onChange }: CategoryComboboxProps) {
  const listId = id ? `${id}-datalist` : 'category-datalist'

  return (
    <>
      <input
        id={id}
        type="text"
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select or type a category"
        className={inputClass}
        autoComplete="off"
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </>
  )
}
