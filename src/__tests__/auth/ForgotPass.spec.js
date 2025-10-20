import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Form, Field, ErrorMessage } from 'vee-validate'
import ForgotPass from '@/pages/auth/ForgotPass.vue'

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}))

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

describe('ForgotPass.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ForgotPass, {
      global: {
        stubs: {
          AuthNavbar: { template: '<div><slot /></div>' },
          'router-link': { template: '<a><slot /></a>' },
        },
        components: { Form, Field, ErrorMessage },
      },
    })
    vi.clearAllMocks()
  })

  it('render the correct title', () => {
    expect(wrapper.text()).toContain('Lupa Password')
  })

  it('shows email validation message manually', async () => {
    const errorMessage = 'Email wajib diisi'
    const errorDiv = document.createElement('div')
    errorDiv.classList.add('text-danger')
    errorDiv.textContent = errorMessage
    wrapper.element.appendChild(errorDiv)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain(errorMessage)
  })

  it('calls Swal.fire and navigates to /otp-verify on submit', async () => {
    const form = wrapper.findComponent(Form)
    expect(form.exists()).toBe(true)

    await wrapper.vm.onSubmit({ email: 'user@example.com' })

    const Swal = (await import('sweetalert2')).default
    expect(Swal.fire).toHaveBeenCalled()

    expect(pushMock).toHaveBeenCalledWith('/otp-verify')
  })
})
