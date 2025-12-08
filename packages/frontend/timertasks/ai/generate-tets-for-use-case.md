# General instructions to create unit tests

## Task

Create unit tests for the use-case, by following the rules and steps below.

## Expected input information

- use_case: file // the name of the use-case, example: GetUser

If the needed information was not provided, then you must ask for this information before you start.

### Rules

1. Always use In-Memory Repositories and its factories to generate data for the tests. Use only the necessary repositories and factories for the test.

### Steps

1. Create a new file at: `{use-case-path}.test.ts`
2. Import the in-memory repositories from `../../__tests__/repositories/{entity-name}.ts`
3. Import the necessary factories from `../../__tests__/factories/{entity-name}.ts`
4. Import the use-case mock from '@modules/tests'.
5. Always set a sut variable to the class that we want to test.
6. Reflect on the use case, what you should create in the setup function, and what you should test in the test cases.
7. Create a setup function to create the necessary data for the test.
   - Use the factories to create the necessary data, and entities.
   - Create many entities using the createMany function from the factories, if you need to create more than one entity.
   - Always try to use the some module from '@modules/tests' to generate random values.
   - Create more setup functions only if the current setup function is really big and complex.
8. Generate the tests
   1. Always use the beforeEach function to reset the In-Memory Repositories.
   2. Always use expectError function to validate errors.
   3.  Create group of tests for:
     - For successful cases
     - Data validation cases
     - Error cases
   4.  Use it.each for cases that are similar, instead of creating multiple tests with the same logic.
   5. Avoid creating to many expect statements in a single test case.
     - Like instead of validation a single field, validate a group of fields.

```typescript
// extra imports to show where you can find the InMemory Repositories and Factories
/*
  All Factories functions
  async create(data: Partial<CustomerProps> = {}): Promise<Customer>

  createMany(
    commonData: Partial<CustomerProps> = {},
    specificData: Partial<CustomerProps>[] = [],
    amount: number = 2,
  ): Promise<Customer[]> 
  */
import { DangerError, DangerErrors } from '@domain/base'
import { expectError, some } from '@modules/tests'

import { InMemoryCustomerRepository } from '../../__tests__/repositories/customer'
import { CustomerFactory } from '../__tests__/factories/customer'


describe('UseCase', () => {
  const customerRepository = new InMemoryCustomerRepository()
  const customerFactory = new CustomerFactory(customerRepository)
  const sut = new SomethingUseCase(customerRepository)

  async function setup() {
    const customer = await customerFactory.create({
      phoneNumber: some.phoneNumber(), // some is already used by the factories, this is just an example, some can also be used in the test cases
    })

    return {
      customer,
    }
  }

  beforeEach(async () => {
    await customerRepository.reset()
  })

  describe('successful cases', () => {
    it('should do something', async () => {
      const { customer } = await setup()
      
      const response = await sut.execute(customer.id)

      const updatedCustomer = await customerRepository.get({
        id: customer.id,
      })
      expect(response).toBe('something')
      expect(updatedCustomer.props).toEqual({
        ...customer.props,
        something: 'something',
      })
    })
  })

  describe('data validation cases', () => {
    it('should throw DangerError when customer does not exist', async () => {
      const error = await expectError(async () => {
        await sut.execute('invalid customer id')
      }, DangerError)

      expect(error.message).toContain('Customer not found')
    })

    it('should throw DangerError when customer is not active', async () => {
      const customer = await customerFactory.create({
        isActive: false,
      })

      const error = await expectError(async () => {
        await sut.execute(customer.id)
      }, DangerError)

      expect(error.message).toContain('Customer is not active')
    })
  })
})
```
## Some module from '@modules/tests'

```typescript
import { randomBytes } from 'node:crypto'

function generateRandomIntegerNumberBetween(start = 1, end = 100): number {
  return Math.floor(Math.random() * (end - start + 1)) + start
}

function generateRandomText(size = 7): string {
  const response = randomBytes(Math.ceil(size / 2)).toString('hex')
  return size % 2 === 0 ? response : response.slice(1)
}

function getRandomNumberWithDecimalPlaces(decimalPlaces: number): number {
  return generateRandomIntegerNumberBetween(
    10 ** (decimalPlaces - 1),
    10 ** decimalPlaces - 1,
  )
}

export const some = {
  text: generateRandomText,
  email: (): string => `${generateRandomText()}@${generateRandomText()}.com`,
  integer: generateRandomIntegerNumberBetween,
  boolean: () => {
    const randomBinaryNumber = generateRandomIntegerNumberBetween(0, 1)
    return randomBinaryNumber === 1
  },
  valueBetween: <T>(...values: T[]): T => {
    const randomIndex = generateRandomIntegerNumberBetween(0, values.length - 1)
    return values[randomIndex]
  },
  randomDecimalNumber: getRandomNumberWithDecimalPlaces,
  phoneNumber() {
    return `55${getRandomNumberWithDecimalPlaces(10)}`
  },
  timestamp() {
    return generateRandomIntegerNumberBetween(1000000000000, Date.now())
  },
  undefinedOr<T>(value: T): T | undefined {
    const randomBinaryNumber = generateRandomIntegerNumberBetween(0, 1)
    return randomBinaryNumber === 1 ? value : undefined
  },
}
```

## Setup Functions examples

```typescript

// setup usually used for query-use-cases tests
async function setup({
  matchingCustomersAmountToCreate = 1,
  nonMatchingCustomersAmountToCreate = 0,
}: {
  matchingCustomersAmountToCreate?: number
  nonMatchingCustomersAmountToCreate?: number
}) {
  const now = getBrazilianDate()
  const today = now.getDate()

  await customerFactory.createMany(
    {
      nextNotification: createNotificationPeriod(now, notificationTime),
      billsData: BillsDataURLParams.create(
        `pending=false&pending_reason=none&day=${today}`,
      ),
      notificationTime,
    },
    [],
    matchingCustomersAmountToCreate,
  )

  await customerFactory.createMany(
    {
      nextNotification: createNotificationPeriod(
        addMonths(cloneDate(now), 1),
        notificationTime,
      ),
      notificationTime,
    },
    [],
    nonMatchingCustomersAmountToCreate,
  )

  return {
    payload: {
      limit: 10,
      paginationData: undefined,
      notificationTime,
    },
  }
}

// setup with overrides
  async function setup({
    customerOverrides = {},
  }: {
    customerOverrides?: Partial<CustomerProps>
  } = {}) {
    const customer = await customerFactory.createCustomerByType('overdue', {
      ...customerOverrides,
    })
   
    return {
      customer,
    }
  }
```

## Old errors

- You should not use vi.useFakeTimers() in the test cases, you should use it in the beforeEach function.

```typescript
// wrong way
it('should so something', async () => {
  vi.useFakeTimers()
  vi.setSystemTime(createDate({ day: 3, month: 1, year: 2025 }))
})

// correct way
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('should so something', async () => {
  vi.setSystemTime(createDate({ day: 3, month: 1, year: 2025 }))
})
```

- You never need to comment code and should use the createData function from the utils module to create a date.

```typescript
// wrong way
it('should so something', async () => {
  const currentDate = new Date(2023, 5, 10) // June 10, 2023
})

// correct way
import { createDate } from '@modules/utils'

it('should do something', async () => {
  vi.setSystemTime(createDate({ day: 3, month: 1, year: 2025 }))
})
```

- DangerError error messages should be specific tested.

```typescript
// wrong way
it('should throw DangerError when customer has an inactive plan status', async () => {
  const { customer } = await setup({
    customerOverrides: {
      planStatus: 'inactive',
    },
  })

  await expectError(async () => {
    await sut.execute({ customer })
  }, DangerError)
})

// correct way
it('should throw DangerError when customer has an invalid plan status', async () => {
  const { customer } = await setup({
    customerOverrides: {
      planStatus: some.valueBetween('inactive', 'canceled', 'overdue'),
    },
  })

  const error = await expectError(async () => {
    await sut.execute({ customer })
  }, DangerError)
  expect(error.message).toContain('Invalid props for customer')
})
```

- CustomerOverrides should typed as Partial<CustomerProps> and not as Record.

```typescript
// wrong way
async function setup({
  customerOverrides = {} as Record<string, unknown>,
}: {
  customerOverrides?: Record<string, unknown>
} = {}) {
  const customer = await customerFactory.createCustomerByType('overdue', {
    ...customerOverrides,
  })

  return {
    customer,
  }
}

// correct way
import { CustomerProps } from '@domain/whatsapp-app'

async function setup({
  customerOverrides = {},
}: {
  customerOverrides?: Partial<CustomerProps>
} = {}) {
  const customer = await customerFactory.createCustomerByType('overdue', {
    ...customerOverrides,
  })

  return {
    customer,
  }
}
```

- Wrong date pattern, by default we use 3rd January of 2025.

```typescript
// wrong way
it('should update customer to overdue when nextPaymentDate is already gone', async () => {
  vi.setSystemTime(createDate({ day: 20, month: 6, year: 2023 }))
})

// correct way
it('should update customer to overdue when nextPaymentDate is already gone', async () => {
  vi.setSystemTime(createDate({ day: 3, month: 1, year: 2025 }))
})
```

## Improve some tests

- Use o some module from '@modules/tests' to generate more variations.

```typescript
// simple way
it('should throw DangerError when customer has an inactive plan status', async () => {
  const { customer } = await setup({
    customerOverrides: {
      planStatus: 'inactive',
    },
  })

  const error = await expectError(async () => {
    await sut.execute({ customer })
  }, DangerError)
  expect(error.message).toContain('Invalid props for customer')
})

// better way
it('should throw DangerError when customer has an invalid plan status', async () => {
  const { customer } = await setup({
    customerOverrides: {
      planStatus: some.valueBetween('inactive', 'canceled', 'overdue'),
    },
  })

  const error = await expectError(async () => {
    await sut.execute({ customer })
  }, DangerError)
  expect(error.message).toContain('Invalid props for customer')
})
```

- Bad tests descriptions

```typescript
// bad way
it('should update customer in repository when changing status to overdue', () => {})

// better way
it('should update customer to overdue when nextPaymentDate is already gone', () => {})
```

- Test bills data field better. Day 3 must always be the default value.

```typescript
// bad way
it('should do something', () => {
  const { customer, chat } = await setup()

  await sut.execute({ customer, chat })

  const updatedCustomer = await customerRepository.get({ id: customer.id })
  expect(updatedCustomer.props.billsData.isPending()).toBe(true)
  expect(updatedCustomer.props.billsData.toString()).toContain(
    'pending_reason=message_not_answered',
  )
})

// better way
it('should do something', () => {
  const { customer, chat } = await setup()

  await sut.execute({ customer, chat })

  const updatedCustomer = await customerRepository.get({ id: customer.id })
  expect(updatedCustomer.props.billsData.toValue()).toBe(
    'pending=true&pending_reason=message_not_answered&day=3',
  )
})
```
- Test descriptions should be more specific. And You should always test group of data rather than a single field.

```typescript
// bad way
it('should set resendNotificationNextTime to 2 hours from now', async () => {})
it('should set resendNotificationStepKey to lastStepKey', async () => {})

// better way
it('should update customer resend data to 2 hours from now', () => {})
```

### Test cases to avoid

```typescript
it('should get customer by customer id', async () => {})
```