import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Form, Field, ErrorMessage } from 'vee-validate'
import NewPass from '@/pages/auth/NewPass.vue'

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}))

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

describe('NewPass.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(NewPass, {
      global: {
        stubs: {
          AuthNavbar: { template: '<div><slot /></div>' },
        },
        components: { Form, Field, ErrorMessage },
      },
    })
    vi.clearAllMocks()
  })

  it('renders the correct title and subtitle', () => {
    const text = wrapper.text()
    expect(text).toContain('Lupa Password')
    expect(text).toContain('Silahkan masukkan password baru')
  })

  it('toggles main password visibility', async () => {
    expect(wrapper.vm.showPassword).toBe(false)
    const mainIcon = wrapper.findAll('.input-icon').at(0)
    await mainIcon.trigger('mousedown')
    await mainIcon.trigger('click')
    expect(wrapper.vm.showPassword).toBe(true)
  })

  it('toggles confirm password visibility', async () => {
    expect(wrapper.vm.showConfirmPassword).toBe(false)
    const confirmIcon = wrapper.findAll('.input-icon').at(1)
    await confirmIcon.trigger('mousedown')
    await confirmIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showConfirmPassword).toBe(true)
  })

  it('calls Swal.fire and navigates to /login on submit', async () => {
    const Swal = (await import('sweetalert2')).default
    await wrapper.vm.onSubmit({
      password: 'Password123!',
      confirmPassword: 'Password123!',
    })

    expect(Swal.fire).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/login')
  })
})
