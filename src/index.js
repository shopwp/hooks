import { findPortalElement, isKeyboardEvent, isEscKey } from "@shopwp/common"

function useAction(hookName, defaultVal = false) {
  const { useState, useEffect } = wp.element
  const { hasAction, addAction } = wp.hooks
  const [data, setData] = useState(() => defaultVal)

  useEffect(() => {
    if (!hasAction(hookName)) {
      addAction(hookName, "shopwp." + hookName, function (newData, extraData) {
        if (extraData) {
          setData([newData, extraData])
        } else {
          setData(newData)
        }
      })
    }
  }, [])

  return data
}

function useOnClickOutside(ref, handler, targetOpened = false) {
  const { useEffect } = wp.element

  function addEventListener(listener) {
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    document.addEventListener("keydown", listener, false)
  }

  function removeEventListener(listener) {
    document.removeEventListener("mousedown", listener)
    document.removeEventListener("touchstart", listener)
    document.removeEventListener("keydown", listener, false)
  }

  function clickedInside(ref, event) {
    return !ref.current || ref.current.contains(event.target)
  }

  function eventListener(event) {
    if (isKeyboardEvent(event)) {
      if (isEscKey(event)) {
        handler(event)
      }
    } else {
      // Do nothing if clicking ref's element or descendent elements
      if (clickedInside(ref, event)) {
        return
      }

      handler(event)
    }
  }

  useEffect(() => {
    if (targetOpened) {
      addEventListener(eventListener)

      return () => removeEventListener(eventListener)
    }
  }, [ref, handler])
}

function usePortal(componentMarkup, containerElement = false) {
  function renderPortal() {
    if (containerElement) {
      var domObject = findPortalElement(containerElement)

      if (domObject) {
        return wp.element.createPortal(componentMarkup, domObject)
      } else {
        return componentMarkup
      }
    }

    return componentMarkup
  }

  return renderPortal()
}

function useCartToggle(dispatch) {
  const { useEffect, useState } = wp.element
  const [cartToggle, setCartToggle] = useState(null)

  function getClosest(elem, selector) {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(
              s
            ),
            i = matches.length
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1
        }
    }

    // Get the closest matching element
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem
    }
    return null
  }

  const escEvent = (event) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      setCartToggle("close")
      dispatch({ type: "TOGGLE_CART", payload: false })
      return
    }
  }

  const clickEvent = (event) => {
    var classList = event.target.classList
    var iconClicked = getClosest(event.target, ".wps-btn-cart")
    var cartClicked = getClosest(event.target, ".shopwp-cart")

    if (classList.contains("wps-modal-close-trigger")) {
      dispatch({ type: "TOGGLE_CART", payload: false })
      return
    }

    if (iconClicked) {
      dispatch({ type: "TOGGLE_CART", payload: true })
      return
    }

    if (!cartClicked) {
      dispatch({ type: "TOGGLE_CART", payload: false })
      return
    }
  }

  useEffect(() => {
    if (shopwp.misc.isMobile) {
      document.addEventListener("touchstart", clickEvent)
    } else {
      document.addEventListener("mousedown", clickEvent)
      document.addEventListener("keydown", escEvent)
    }

    // Remove event listeners on cleanup
    return () => {
      if (shopwp.misc.isMobile) {
        document.removeEventListener("touchstart", clickEvent)
      } else {
        document.removeEventListener("mousedown", clickEvent)
        document.removeEventListener("keydown", escEvent)
      }
    }
  }, [])

  return cartToggle
}

function useSettings(settings, customSettings) {
  const { useState } = wp.element

  const [allSettings] = useState(() => {
    if (!customSettings) {
      return settings
    } else {
      return { ...settings, ...customSettings }
    }
  })

  return allSettings
}

function useFirstRender() {
  const { useRef } = wp.element
  const firstUpdate = useRef(true)

  if (firstUpdate.current) {
    firstUpdate.current = false
    return true
  }

  return firstUpdate.current
}

export {
  useAction,
  useOnClickOutside,
  usePortal,
  useCartToggle,
  useSettings,
  useFirstRender,
}
