import { ref, shallowRef } from 'vue'

export function useDialog(defaultComponent?, editSuccessCallback?: (...args: []) => void) {
  const visible = ref(false)
  const Component = shallowRef()
  const ComponentData = ref({})

  function openDialog(component, data = {}) {
    ComponentData.value = data
    Component.value = component
    visible.value = true
  }

  function editSuccess(...args: []) {
    visible.value = false
    if (editSuccessCallback) {
      editSuccessCallback(...args)
    }
  }

  function close() {
    visible.value = false
  }

  Component.value = defaultComponent

  return {
    visible,
    Component,
    ComponentData,
    openDialog,
    editSuccess,
    close
  }
}
