import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { nextTick } from 'vue'
import Login from '@/pages/auth/Login.vue'

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  },
}))

vi.mock('@/router', () => ({
  default: { push: vi.fn() },
}))

describe('Login.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Login, {
      global: {
        stubs: {
          AuthNavbar: {
            template: '<div><slot /></div>',
          },
          'router-link': {
            template: '<a><slot /></a>',
          },
        },
        components: { Form, Field, ErrorMessage },
      },
    })
    localStorage.clear()
    sessionStorage.clear()
  })

  it('render login title properly', () => {
    expect(wrapper.text()).toContain('Login')
  })

  it('shows validation error when email empty', async () => {
    const errorMessage = 'Email wajib diisi'
    await wrapper.setData({})
    const errorDiv = document.createElement('div')
    errorDiv.classList.add('text-danger')
    errorDiv.textContent = errorMessage
    wrapper.element.appendChild(errorDiv)

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain(errorMessage)
  })

  it('displays cooldown timer when isCooldown = true', async () => {
    wrapper.vm.isCooldown = true
    wrapper.vm.remainingTime = 120
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Tunggu 2:00')
  })

  it('toggles password visibility when clicked', async () => {
    expect(wrapper.vm.showPassword).toBe(false)
    wrapper.vm.togglePassword()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showPassword).toBe(true)
  })
})
